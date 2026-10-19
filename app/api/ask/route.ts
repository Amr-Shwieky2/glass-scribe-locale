import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLocale } from '@/lib/i18n';
import {
  aiFallback as fallback,
  checkAiLimits,
  envLimit,
  fastAnswerOptions,
  getAnthropicClient,
  isSameOrigin,
  logAnthropicError,
  scrubForLog,
} from '@/lib/ai';
import { detectLanguage, retrievePassages } from '@/lib/search/retrieve';
import { buildAskSystemPrompt } from '@/lib/search/ask-prompt';

/**
 * "Ask AI" endpoint for the home page search box.
 *
 * Streams a short answer (text/plain) grounded in our own site content.
 * When the AI isn't available (no ANTHROPIC_API_KEY, rate/daily limit hit,
 * upstream error) it returns JSON `{ fallback: <reason> }` instead, and the
 * page keeps working with instant site results + a WhatsApp prompt.
 *
 * Privacy: no names/phones/IPs are stored. Only the question text (with
 * phone numbers and emails scrubbed) and its language are logged.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_QUESTION = 300;
const MAX_TOKENS = 400;
const MODEL = process.env.AI_SEARCH_MODEL || 'claude-haiku-5-5';
const DAILY_LIMIT = envLimit(process.env.AI_SEARCH_DAILY_LIMIT, 500);

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => null) as { question?: unknown; lang?: unknown } | null;
  const question = typeof body?.question === 'string' ? body.question.replace(/\s+/g, ' ').trim() : '';
  const pageLang = typeof body?.lang === 'string' && isLocale(body.lang) ? body.lang : 'he';

  if (question.length < 2) return NextResponse.json({ error: 'Question required' }, { status: 400 });
  if (question.length > MAX_QUESTION) return NextResponse.json({ error: 'Question too long' }, { status: 400 });

  const anthropic = getAnthropicClient();
  if (!anthropic) return fallback('unavailable', 503);

  const limited = await checkAiLimits(req, { bucket: 'ai-ask', perIp: { limit: 10, windowSec: 3600 }, dailyLimit: DAILY_LIMIT });
  if (limited) return limited;

  const answerLang = detectLanguage(question, pageLang);
  const passages = retrievePassages(question, answerLang, 5);

  console.log(JSON.stringify({ event: 'ai_search_question', lang: answerLang, question: scrubForLog(question) }));

  const userContent = [
    '<site_content>',
    ...passages.map((p, i) => `[${i + 1}] ${p.title}\nURL: ${p.url}\n${p.text}`),
    '</site_content>',
    '',
    `<answer_language>${answerLang}</answer_language>`,
    '<visitor_question>',
    question,
    '</visitor_question>',
  ].join('\n');

  let stream: ReturnType<typeof anthropic.messages.stream>;
  try {
    stream = anthropic.messages.stream(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Short factual answers: no extended thinking on Haiku, low effort everywhere
        ...fastAnswerOptions(MODEL),
        system: [{ type: 'text', text: buildAskSystemPrompt(), cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: userContent }],
      },
      { signal: req.signal }
    );
  } catch (err) {
    console.error('[ask] failed to start stream', err);
    return fallback('error', 502);
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sentText = false;
      try {
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            sentText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal' && !sentText) {
          // Client shows the WhatsApp fallback when the body is empty
          console.warn('[ask] refusal', final.stop_details?.category ?? null);
        }
      } catch (err) {
        logAnthropicError('ask', err);
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
