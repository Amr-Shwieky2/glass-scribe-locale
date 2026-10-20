/**
 * Shared rate limiter for API routes.
 *
 * Uses Upstash Redis (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) so
 * limits hold across serverless instances. Without those env vars it falls back
 * to an in-memory limiter — fine for local dev, but per-instance only on Vercel
 * (a warning is logged once).
 */
import { Ratelimit } from '@upstash/ratelimit';
import type { Redis } from '@upstash/redis';
import { getRedis, redisErrorSummary } from './redis';

export interface RateLimitOptions {
  /** Max requests per window. */
  limit: number;
  /** Window length in seconds. */
  windowSec: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  /** Unix ms when the window resets. */
  reset: number;
}

// =============================================================================
// UPSTASH
// =============================================================================

/** After this long without an answer from Upstash, the request is counted in memory instead. */
const UPSTASH_TIMEOUT_MS = 1_500;

const limiters = new Map<string, Ratelimit>();
function getUpstashLimiter(name: string, { limit, windowSec }: RateLimitOptions, client: Redis): Ratelimit {
  const id = `${name}:${limit}:${windowSec}`;
  let limiter = limiters.get(id);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: client,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: `rl:${name}`,
      analytics: false,
      timeout: UPSTASH_TIMEOUT_MS,
    });
    limiters.set(id, limiter);
  }
  return limiter;
}

// =============================================================================
// IN-MEMORY FALLBACK (fixed window)
// =============================================================================

const memory = new Map<string, { count: number; reset: number }>();

function memoryLimit(name: string, key: string, { limit, windowSec }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  if (memory.size > 10_000) {
    for (const [k, v] of memory) if (v.reset <= now) memory.delete(k);
  }
  const id = `${name}:${key}`;
  let entry = memory.get(id);
  if (!entry || entry.reset <= now) {
    entry = { count: 0, reset: now + windowSec * 1000 };
    memory.set(id, entry);
  }
  entry.count++;
  return { success: entry.count <= limit, remaining: Math.max(0, limit - entry.count), reset: entry.reset };
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Counts one request for `key` in bucket `name`.
 * Fails open (falls back to the per-instance memory limiter) if Redis errors or
 * doesn't answer within 1.5 s, so an Upstash outage never takes the contact
 * form down or slows every request.
 */
export async function rateLimit(name: string, key: string, options: RateLimitOptions): Promise<RateLimitResult> {
  const client = getRedis();
  if (!client) return memoryLimit(name, key, options);

  try {
    const { success, remaining, reset, reason } = await getUpstashLimiter(name, options, client).limit(key);
    if (reason === 'timeout') {
      console.error('[rate-limit] Upstash timed out, falling back to memory');
      return memoryLimit(name, key, options);
    }
    return { success, remaining, reset };
  } catch (err) {
    // Only the error's name and text: Upstash adds the command, whose key holds the client IP
    console.error('[rate-limit] Upstash error, falling back to memory:', redisErrorSummary(err));
    return memoryLimit(name, key, options);
  }
}

/** Best-effort client IP (Vercel sets x-forwarded-for / x-real-ip). */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Standard 429 headers. */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'Retry-After': String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))),
    'X-RateLimit-Remaining': String(result.remaining),
  };
}
