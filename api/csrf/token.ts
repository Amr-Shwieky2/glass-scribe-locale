/**
 * CSRF Token Generation Endpoint
 * Generates secure CSRF tokens for form protection
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes } from 'crypto';

// =============================================================================
// INLINE SECURITY UTILITIES (for Vercel bundling)
// =============================================================================

const RATE_LIMITS = { api: { window: 60 * 1000, max: 30 } } as const;

const ALLOWED_ORIGINS = [
  'https://shwakiglassworks.com',
  'https://www.shwakiglassworks.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean);

function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') { res.status(204).end(); return false; }
  return true;
}

function addSecurityHeaders(res: VercelResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
}

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return (req.headers['x-real-ip'] as string) || 'unknown';
}

function validateMethod(req: VercelRequest, res: VercelResponse, allowedMethods: string[]): boolean {
  if (!allowedMethods.includes(req.method || '')) {
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  return true;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, type: keyof typeof RATE_LIMITS = 'api'): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[type];
  const key = `${type}:${ip}`;
  const now = Date.now();
  if (Math.random() < 0.1) {
    for (const [k, v] of rateLimitStore.entries()) { if (now > v.resetTime) rateLimitStore.delete(k); }
  }
  const record = rateLimitStore.get(key);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.window });
    return { allowed: true, remaining: config.max - 1, resetIn: config.window };
  }
  if (record.count >= config.max) return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  record.count++;
  return { allowed: true, remaining: config.max - record.count, resetIn: record.resetTime - now };
}

function addRateLimitHeaders(res: VercelResponse, limit: { remaining: number; resetIn: number }, max: number): void {
  res.setHeader('X-RateLimit-Limit', max.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit.remaining).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(limit.resetIn / 1000).toString());
}

const CSRF_TOKEN_VALIDITY = 30 * 60 * 1000;
const csrfTokenStore = new Map<string, { token: string; expires: number }>();

function generateCSRFToken(sessionId: string): string {
  const token = randomBytes(32).toString('hex');
  const expires = Date.now() + CSRF_TOKEN_VALIDITY;
  csrfTokenStore.set(sessionId, { token, expires });
  if (Math.random() < 0.1) {
    const now = Date.now();
    for (const [key, value] of csrfTokenStore.entries()) {
      if (now > value.expires) csrfTokenStore.delete(key);
    }
  }
  return token;
}

function getCSRFCookieOptions(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return ['Path=/', `Max-Age=${CSRF_TOKEN_VALIDITY / 1000}`, isProduction ? 'Secure' : '', 'HttpOnly', 'SameSite=Strict'].filter(Boolean).join('; ');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add security headers
  addSecurityHeaders(res);
  
  // Handle CORS
  if (!handleCORS(req, res)) return;
  
  // Validate method (GET only for token retrieval)
  if (!validateMethod(req, res, ['GET', 'OPTIONS'])) return;
  
  // Rate limiting
  const ip = getClientIP(req);
  const rateLimit = checkRateLimit(ip, 'api');
  addRateLimitHeaders(res, rateLimit, RATE_LIMITS.api.max);
  
  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.ceil(rateLimit.resetIn / 1000),
    });
  }
  
  try {
    // Generate session ID based on IP + User-Agent (stateless approach)
    const userAgent = req.headers['user-agent'] || '';
    const sessionId = `${ip}:${userAgent.slice(0, 50)}`;
    
    // Generate CSRF token
    const csrfToken = generateCSRFToken(sessionId);
    
    // Set CSRF token as HTTP-only cookie as well (double-submit pattern)
    res.setHeader('Set-Cookie', `csrf_token=${csrfToken}; ${getCSRFCookieOptions()}`);
    
    // Return token for client-side inclusion in form
    return res.status(200).json({
      success: true,
      token: csrfToken,
      expiresIn: 30 * 60, // 30 minutes in seconds
    });
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return res.status(500).json({ error: 'Failed to generate token' });
  }
}
