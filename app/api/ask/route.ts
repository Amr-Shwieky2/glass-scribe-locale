import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLocale } from '@/lib/i18n';
import { getClientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
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
const DAILY_LIMIT = Math.max(1, parseInt(process.env.AI_SEARCH_DAILY_LIMIT || '500', 10) || 500);

const ALLOWED_HOSTS = new Set(['www.shwakiglassworks.com', 'shwakiglassworks.com']);

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic({ maxRetries: 1, timeout: 20_000 });
  return client;
}

/** Same-origin only: the browser's Origin must match this deployment's host. */
function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!origin || !host) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  if (originHost !== host) return false;
  const hostname = host.split(':')[0];
  return (
    ALLOWED_HOSTS.has(hostname) ||
    hostname === process.env.VERCEL_URL ||
    hostname === process.env.VERCEL_BRANCH_URL ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  );
}

const fallback = (reason: 'unavailable' | 'rate_limited' | 'daily_limit' | 'error', status: number, headers?: Record<string, string>) =>
  NextResponse.json({ fallback: reason }, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

/** Strips phone numbers and e-mail addresses before logging. */
const scrubForLog = (q: string) =>
  q.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]').replace(/\+?\d[\d\s\-()]{6,}\d/g, '[phone]');

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => null) as { question?: unknown; lang?: unknown } | null;
  const question = typeof body?.question === 'string' ? body.question.replace(/\s+/g, ' ').trim() : '';
  const pageLang = typeof body?.lang === 'string' && isLocale(body.lang) ? body.lang : 'he';

  if (question.length < 2) return NextResponse.json({ error: 'Question required' }, { status: 400 });
  if (question.length > MAX_QUESTION) return NextResponse.json({ error: 'Question too long' }, { status: 400 });

  const anthropic = getClient();
  if (!anthropic) return fallback('unavailable', 503);

  const perIp = await rateLimit('ai-ask', getClientIp(req.headers), { limit: 10, windowSec: 3600 });
  if (!perIp.success) return fallback('rate_limited', 429, rateLimitHeaders(perIp));

  const daily = await rateLimit('ai-ask-daily', 'global', { limit: DAILY_LIMIT, windowSec: 86400 });
  if (!daily.success) return fallback('daily_limit', 429, rateLimitHeaders(daily));

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

  const isHaiku = MODEL.startsWith('claude-haiku');

  let stream: ReturnType<typeof anthropic.messages.stream>;
  try {
    stream = anthropic.messages.stream(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Short factual answers: no extended thinking on Haiku (allowed at effort ≤ high), low effort everywhere
        ...(isHaiku ? { thinking: { type: 'disabled' as const } } : {}),
        output_config: { effort: 'low' },
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
        if (err instanceof Anthropic.APIUserAbortError) {
          // visitor closed the page — nothing to do
        } else if (err instanceof Anthropic.RateLimitError) {
          console.error('[ask] Anthropic rate limit');
        } else if (err instanceof Anthropic.APIError) {
          console.error(`[ask] Anthropic API error ${err.status}`, err.message);
        } else {
          console.error('[ask] stream error', err);
        }
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
