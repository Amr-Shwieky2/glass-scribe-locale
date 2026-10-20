/**
 * Shared server helpers for the assistant routes (/api/ask, /api/chat):
 * the same-origin check and small utilities. Server-only.
 */
import type { NextRequest } from 'next/server';

const ALLOWED_HOSTS = new Set(['www.shwakiglassworks.com', 'shwakiglassworks.com']);

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

/** Positive integer from an env var, or `fallback`. */
export function envLimit(value: string | undefined, fallback: number): number {
  return Math.max(1, parseInt(value || String(fallback), 10) || fallback);
}
