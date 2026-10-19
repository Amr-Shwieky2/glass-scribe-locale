import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminSessionConfigured, setAdminSession } from '@/lib/admin-session';
import { safeEqual } from '@/lib/signed-token';
import { getClientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

/**
 * Admin login. On success sets a signed 24h httpOnly session cookie — the
 * response body never contains a token.
 */
export async function POST(req: NextRequest) {
  const limit = await rateLimit('login', getClientIp(req.headers), { limit: 5, windowSec: 15 * 60 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many login attempts' }, { status: 429, headers: rateLimitHeaders(limit) });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !isAdminSessionConfigured()) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const password = (body as { password?: unknown }).password;
  if (typeof password !== 'string' || !password || password.length > 128) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
  }

  if (!safeEqual(password.trim(), expected.trim())) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  if (!setAdminSession(res)) return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  return res;
}
