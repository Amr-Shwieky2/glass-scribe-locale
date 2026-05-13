import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { timingSafeEqual, createHash } from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MULTIPLIER = 2;

const loginAttempts = new Map<string, { 
  count: number; 
  firstAttempt: number; 
  lockoutUntil: number;
  lockoutCount: number;
}>();

function cleanupRateLimits() {
  const now = Date.now();
  for (const [ip, data] of loginAttempts.entries()) {
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW * 4) {
      loginAttempts.delete(ip);
    }
  }
}

function checkRateLimit(ip: string) {
  cleanupRateLimits();
  const now = Date.now();
  const data = loginAttempts.get(ip);

  if (!data) return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW, lockedOut: false };
  if (data.lockoutUntil > now) return { allowed: false, remaining: 0, resetIn: data.lockoutUntil - now, lockedOut: true };

  if (now - data.firstAttempt > RATE_LIMIT_WINDOW && data.lockoutUntil <= now) {
    loginAttempts.set(ip, { count: 0, firstAttempt: now, lockoutUntil: 0, lockoutCount: data.lockoutCount });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW, lockedOut: false };
  }

  if (data.count >= MAX_ATTEMPTS) {
    const lockoutTime = RATE_LIMIT_WINDOW * Math.pow(LOCKOUT_MULTIPLIER, data.lockoutCount);
    data.lockoutUntil = now + lockoutTime;
    data.lockoutCount++;
    return { allowed: false, remaining: 0, resetIn: lockoutTime, lockedOut: true };
  }

  return { 
    allowed: true, 
    remaining: MAX_ATTEMPTS - data.count - 1, 
    resetIn: RATE_LIMIT_WINDOW - (now - data.firstAttempt),
    lockedOut: false,
  };
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const data = loginAttempts.get(ip);

  if (!data || now - data.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now, lockoutUntil: 0, lockoutCount: 0 });
  } else {
    data.count++;
  }
}

function verifyPassword(provided: string, expected: string) {
  if (!provided || !expected) return false;
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  try { return timingSafeEqual(providedHash, expectedHash); } catch { return false; }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json({ error: rateLimit.lockedOut ? 'Account temporarily locked' : 'Too many login attempts' }, { status: 429 });
  }

  if (!ADMIN_PASSWORD || !ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length > 128) {
      recordAttempt(ip);
      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    if (!verifyPassword(password.trim(), ADMIN_PASSWORD.trim())) {
      recordAttempt(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    loginAttempts.delete(ip);
    return NextResponse.json({ success: true, token: ADMIN_TOKEN }, { status: 200 });
  } catch (error) {
    recordAttempt(ip);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
