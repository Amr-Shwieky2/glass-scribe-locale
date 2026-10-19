/**
 * Admin session: a signed, 24h token in an httpOnly / Secure / SameSite=Strict
 * cookie. The browser never sees a long-lived secret, and the cookie can't be
 * read by page scripts or sent cross-site.
 *
 * Server-only. Requires ADMIN_SESSION_SECRET (fails closed when missing).
 */
import type { NextRequest, NextResponse } from 'next/server';
import { createSignedToken, verifySignedToken } from './signed-token';

export const ADMIN_COOKIE = 'shwaki_admin_session';
const SESSION_TTL_SECONDS = 24 * 60 * 60;
const TOKEN_TYPE = 'admin-session';

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

export function isAdminSessionConfigured(): boolean {
  return getSecret() !== null && !!process.env.ADMIN_PASSWORD;
}

const cookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge,
});

/** Issues a fresh session cookie on `res`. Returns the expiry (unix ms). */
export function setAdminSession(res: NextResponse): number | null {
  const secret = getSecret();
  if (!secret) return null;
  const { token, exp } = createSignedToken(TOKEN_TYPE, SESSION_TTL_SECONDS, secret, { sub: 'admin' });
  res.cookies.set(ADMIN_COOKIE, token, cookieOptions(SESSION_TTL_SECONDS));
  return exp * 1000;
}

export function clearAdminSession(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, '', cookieOptions(0));
}

/** Verifies the session cookie (signature checked in constant time). Returns expiry (unix ms) or null. */
export function getAdminSession(req: NextRequest): { expiresAt: number } | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = verifySignedToken<{ sub: string }>(req.cookies.get(ADMIN_COOKIE)?.value, TOKEN_TYPE, secret);
  return payload && payload.sub === 'admin' ? { expiresAt: payload.exp * 1000 } : null;
}

export function isAdminRequest(req: NextRequest): boolean {
  return getAdminSession(req) !== null;
}
