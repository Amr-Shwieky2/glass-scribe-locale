/**
 * Shared Upstash Redis client (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN),
 * or null when not configured — callers fall back to in-memory storage.
 *
 * Every caller is best-effort (rate limits fail open, unanswered questions are
 * optional), so a request gives up quickly instead of holding a function open:
 * one retry on a network error and at most 3 seconds per command.
 */
import { Redis } from '@upstash/redis';

const RETRIES = 1;
const REQUEST_TIMEOUT_MS = 3_000;

let redis: Redis | null | undefined;

export function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token
    ? new Redis({
        url,
        token,
        retry: { retries: RETRIES, backoff: () => 100 },
        // A function, so every command gets its own deadline
        signal: () => AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
    : null;
  if (!redis) {
    console.warn('[redis] UPSTASH_REDIS_REST_URL/TOKEN not set — using in-memory storage (not shared across serverless instances).');
  }
  return redis;
}

/**
 * An Upstash error for the logs, without its payload: Upstash puts the failed
 * command (keys such as client IPs, values such as visitors' questions) or the
 * response body into the message.
 */
export function redisErrorSummary(err: unknown): string {
  if (!(err instanceof Error)) return 'unknown error';
  if (err.name === 'UpstashJSONParseError') return err.name;
  return `${err.name}: ${err.message.split(/,? command was/)[0].slice(0, 200)}`;
}
