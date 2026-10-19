/**
 * Compact HMAC-SHA256 signed tokens: base64url(JSON payload) + "." + base64url(signature).
 * Used for CSRF tokens and the admin session cookie. Signatures are compared in
 * constant time and every token carries an expiry and a purpose (`typ`), so a
 * token minted for one use can't be replayed for another.
 *
 * Server-only (node:crypto).
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

interface BasePayload {
  typ: string;
  /** Expiry, unix seconds. */
  exp: number;
  /** Random nonce. */
  n: string;
}

const b64url = (buf: Buffer | string) => Buffer.from(buf).toString('base64url');

function sign(data: string, secret: string): Buffer {
  return createHmac('sha256', secret).update(data).digest();
}

export function createSignedToken(typ: string, ttlSeconds: number, secret: string, extra: Record<string, unknown> = {}): { token: string; exp: number } {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload: BasePayload = { ...extra, typ, exp, n: randomBytes(16).toString('hex') };
  const body = b64url(JSON.stringify(payload));
  return { token: `${body}.${b64url(sign(body, secret))}`, exp };
}

export function verifySignedToken<T extends object = Record<string, unknown>>(
  token: unknown,
  typ: string,
  secret: string
): (T & BasePayload) | null {
  if (typeof token !== 'string' || token.length > 2048) return null;
  const dot = token.indexOf('.');
  if (dot <= 0 || dot !== token.lastIndexOf('.')) return null;

  const body = token.slice(0, dot);
  let provided: Buffer;
  try {
    provided = Buffer.from(token.slice(dot + 1), 'base64url');
  } catch {
    return null;
  }
  const expected = sign(body, secret);
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as T & BasePayload;
    if (payload.typ !== typ) return null;
    if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Constant-time string comparison (hashes first so lengths don't leak). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHmac('sha256', 'cmp').update(a).digest();
  const hb = createHmac('sha256', 'cmp').update(b).digest();
  return timingSafeEqual(ha, hb);
}
