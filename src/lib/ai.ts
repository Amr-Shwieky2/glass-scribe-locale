/**
 * Shared server helpers for the AI routes (/api/ask and /api/chat): the
 * Anthropic client, the same-origin check, rate limits and fallback responses.
 * Server-only.
 */
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getClientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

export type AiFallbackReason = 'unavailable' | 'rate_limited' | 'daily_limit' | 'error';

const ALLOWED_HOSTS = new Set(['www.shwakiglassworks.com', 'shwakiglassworks.com']);

let client: Anthropic | null = null;

/** The Anthropic client, or null when ANTHROPIC_API_KEY isn't set. */
export function getAnthropicClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic({ maxRetries: 1, timeout: 20_000 });
  return client;
}

/** Same-origin only: the browser's Origin must match this deployment's host. */
export function isSameOrigin(req: NextRequest): boolean {
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

/** `{ fallback: reason }` — the UI swaps in site results + WhatsApp/call. */
export function aiFallback(reason: AiFallbackReason, status: number, headers?: Record<string, string>) {
  return NextResponse.json({ fallback: reason }, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

/** Positive integer from an env var, or `fallback`. */
export function envLimit(value: string | undefined, fallback: number): number {
  return Math.max(1, parseInt(value || String(fallback), 10) || fallback);
}

/**
 * Per-IP limit, then the site-wide daily cap. Returns the fallback response to
 * send when a limit is hit, or null to continue.
 */
export async function checkAiLimits(
  req: NextRequest,
  opts: { bucket: string; perIp: { limit: number; windowSec: number }; dailyLimit: number }
): Promise<NextResponse | null> {
  const perIp = await rateLimit(opts.bucket, getClientIp(req.headers), opts.perIp);
  if (!perIp.success) return aiFallback('rate_limited', 429, rateLimitHeaders(perIp));

  const daily = await rateLimit(`${opts.bucket}-daily`, 'global', { limit: opts.dailyLimit, windowSec: 86400 });
  if (!daily.success) return aiFallback('daily_limit', 429, rateLimitHeaders(daily));

  return null;
}

/**
 * Request options for short, fast answers: no extended thinking on Haiku
 * (allowed there at effort ≤ high) and low effort on every model.
 */
export function fastAnswerOptions(model: string) {
  return {
    ...(model.startsWith('claude-haiku') ? { thinking: { type: 'disabled' as const } } : {}),
    output_config: { effort: 'low' as const },
  };
}

/** Strips phone numbers and e-mail addresses before logging. */
export function scrubForLog(text: string): string {
  return text.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]').replace(/\+?\d[\d\s\-()]{6,}\d/g, '[phone]');
}

/** Logs an Anthropic failure without request content. */
export function logAnthropicError(scope: string, err: unknown): void {
  if (err instanceof Anthropic.APIUserAbortError) return; // visitor closed the page
  if (err instanceof Anthropic.RateLimitError) console.error(`[${scope}] Anthropic rate limit`);
  else if (err instanceof Anthropic.APIError) console.error(`[${scope}] Anthropic API error ${err.status}`, err.message);
  else console.error(`[${scope}] stream error`, err);
}
