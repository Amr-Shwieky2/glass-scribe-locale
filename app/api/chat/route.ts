import type Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLocale } from '@/lib/i18n';
import {
  aiFallback,
  checkAiLimits,
  envLimit,
  fastAnswerOptions,
  getAnthropicClient,
  isSameOrigin,
  logAnthropicError,
} from '@/lib/ai';
import { isBusinessOpen } from '@/lib/business-hours';
import { conversationLanguage, retrievePassages } from '@/lib/search/retrieve';
import { QUOTE_TOOL, QUOTE_TOOL_NAME, buildChatSystemPrompt } from '@/lib/search/chat-prompt';
import { CHAT_LIMITS, QUOTE_FIELD_LIMITS, type ChatStreamEvent, type ChatTurn, type QuoteDraft } from '@/lib/chat-protocol';
import { cleanText, readJsonBody } from '@/lib/validation';
import type { SupportedLocale } from '@/data/types';

/**
 * Site-wide chat assistant.
 *
 * Streams NDJSON events (see src/lib/chat-protocol.ts). Each turn is grounded
 * in passages retrieved from our own content. The model can ask to show a
 * quote-request form (prepare_quote_request); it never sends anything itself —
 * the visitor confirms in the widget, which then calls /api/chat/lead.
 *
 * Privacy: conversations are not stored. Logs contain only the event name,
 * language and message count.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_TOKENS = 500;
const MAX_BODY_BYTES = 64 * 1024;
const MODEL = process.env.AI_CHAT_MODEL || process.env.AI_SEARCH_MODEL || 'claude-haiku-5-5';
const DAILY_LIMIT = envLimit(process.env.AI_CHAT_DAILY_LIMIT, 1000);

type Parsed = { messages: ChatTurn[]; lang: SupportedLocale } | { error: string };

/** Validates the request; keeps at most the last 12 messages (starting with a visitor message). */
function parseRequest(body: unknown): Parsed {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Invalid request' };
  const { messages, lang, ...rest } = body as Record<string, unknown>;
  if (Object.keys(rest).length) return { error: 'Unexpected field' };
  if (lang !== undefined && (typeof lang !== 'string' || !isLocale(lang))) return { error: 'Invalid lang' };
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) return { error: 'Invalid messages' };

  const turns: ChatTurn[] = [];
  for (const [i, m] of messages.entries()) {
    if (!m || typeof m !== 'object' || Array.isArray(m)) return { error: 'Invalid message' };
    const { role, content, ...extra } = m as Record<string, unknown>;
    if (Object.keys(extra).length) return { error: 'Invalid message' };
    if (role !== 'user' && role !== 'assistant') return { error: 'Invalid role' };
    const text = cleanText(content);
    if (!text) return { error: 'Empty message' };
    if (role === 'user' && text.length > CHAT_LIMITS.maxUserChars) return { error: 'Message too long' };
    if (role === 'assistant' && text.length > CHAT_LIMITS.maxAssistantChars) return { error: 'Message too long' };
    const expected = i % 2 === 0 ? 'user' : 'assistant';
    if (role !== expected) return { error: 'Roles must alternate, starting with the visitor' };
    turns.push({ role, content: text });
  }
  if (turns[turns.length - 1].role !== 'user') return { error: 'Last message must be from the visitor' };

  let kept = turns.slice(-CHAT_LIMITS.maxMessages);
  if (kept[0].role === 'assistant') kept = kept.slice(1);
  return { messages: kept, lang: (lang as SupportedLocale | undefined) ?? 'he' };
}

/** Retrieval query: the latest message plus a short summary of what the visitor asked before. */
function retrievalQuery(messages: ChatTurn[]): string {
  const userTexts = messages.filter((m) => m.role === 'user').map((m) => m.content);
  const latest = userTexts[userTexts.length - 1];
  const earlier = userTexts.slice(-3, -1).join(' ').slice(0, 300);
  return earlier ? `${latest} ${earlier}` : latest;
}

const clip = (v: unknown, max: number) => cleanText(v).slice(0, max);

function sanitizeQuote(input: unknown, fallbackLang: SupportedLocale): QuoteDraft {
  const q = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const language = typeof q.language === 'string' && isLocale(q.language) ? q.language : fallbackLang;
  return {
    name: clip(q.name, QUOTE_FIELD_LIMITS.name),
    phone: clip(q.phone, QUOTE_FIELD_LIMITS.phone),
    city: clip(q.city, QUOTE_FIELD_LIMITS.city),
    service: clip(q.service, QUOTE_FIELD_LIMITS.service),
    details: clip(q.details, QUOTE_FIELD_LIMITS.details),
    language,
  };
}

function toAnthropicMessages(messages: ChatTurn[], latestContext: string): Anthropic.MessageParam[] {
  return messages.map((m, i) => {
    if (m.role === 'assistant') return { role: 'assistant', content: m.content };
    const isLatest = i === messages.length - 1;
    const visitor = `<visitor_message>\n${m.content}\n</visitor_message>`;
    return { role: 'user', content: isLatest ? `${latestContext}\n\n${visitor}` : visitor };
  });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await readJsonBody(req, MAX_BODY_BYTES);
  if (body.tooLarge) return NextResponse.json({ error: 'Request too large' }, { status: 413 });

  const parsed = parseRequest(body.value);
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { messages, lang } = parsed;

  const anthropic = getAnthropicClient();
  if (!anthropic) return aiFallback('unavailable', 503);

  const limited = await checkAiLimits(req, { bucket: 'ai-chat', perIp: { limit: 30, windowSec: 3600 }, dailyLimit: DAILY_LIMIT });
  if (limited) return limited;

  // Language of the conversation: a short "OK" or a phone number doesn't switch it to English
  const answerLang = conversationLanguage(messages.filter((m) => m.role === 'user').map((m) => m.content), lang);
  const passages = retrievePassages(retrievalQuery(messages), answerLang, 5);

  console.log(JSON.stringify({ event: 'chat_message', lang: answerLang, messages: messages.length }));

  const latestContext = [
    '<site_content>',
    ...passages.map((p, i) => `[${i + 1}] ${p.title}\nURL: ${p.url}\n${p.text}`),
    '</site_content>',
    '',
    `<business_status>${isBusinessOpen() ? 'open now' : 'closed now'}</business_status>`,
    `<answer_language>${answerLang}</answer_language>`,
  ].join('\n');

  const stream = anthropic.messages.stream(
    {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      ...fastAnswerOptions(MODEL),
      system: [{ type: 'text', text: buildChatSystemPrompt(), cache_control: { type: 'ephemeral' } }],
      tools: [QUOTE_TOOL],
      tool_choice: { type: 'auto' },
      messages: toAnthropicMessages(messages, latestContext),
    },
    { signal: req.signal }
  );

  // Wait for the first event so a failure to start (bad key, outage) becomes a clean JSON fallback
  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    first = await events.next();
  } catch (err) {
    logAnthropicError('chat', err);
    return aiFallback('error', 502);
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatStreamEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      let sentText = false;
      const handle = (event: Anthropic.MessageStreamEvent) => {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta' && event.delta.text) {
          sentText = true;
          send({ type: 'text', text: event.delta.text });
        }
      };

      try {
        if (!first.done) handle(first.value);
        for (let next = await events.next(); !next.done; next = await events.next()) handle(next.value);

        const final = await stream.finalMessage();
        const toolUse = final.content.find(
          (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use' && b.name === QUOTE_TOOL_NAME
        );
        if (toolUse) {
          send({ type: 'quote', quote: sanitizeQuote(toolUse.input, answerLang) });
          console.log(JSON.stringify({ event: 'chat_quote_card', lang: answerLang }));
        } else if (!sentText) {
          if (final.stop_reason === 'refusal') console.warn('[chat] refusal', final.stop_details?.category ?? null);
          send({ type: 'fallback', reason: 'error' });
        }
        send({ type: 'done' });
      } catch (err) {
        logAnthropicError('chat', err);
        try {
          send(sentText ? { type: 'error' } : { type: 'fallback', reason: 'error' });
        } catch {
          /* client already gone */
        }
      } finally {
        try { controller.close(); } catch { /* already closed */ }
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
