/**
 * @fileoverview Admin Login API
 * @description Simple password authentication for admin panel.
 * HIGH SECURITY: Timing-safe comparison, strict rate limiting, lockout protection
 * 
 * BODY:
 * - password: The admin password
 * 
 * RETURNS:
 * - token: Admin token for authenticated requests
 * 
 * SECURITY:
 * - Rate limiting: 5 attempts per IP per 15 minutes
 * - Timing-safe password comparison (prevents timing attacks)
 * - Progressive lockout for repeated failures
 * - Input length validation (prevents DoS)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual, createHash } from 'crypto';

// =============================================================================
// INLINE SECURITY UTILITIES (for Vercel bundling)
// =============================================================================

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

function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  if (input.length > maxLength * 2) return '';
  // eslint-disable-next-line no-control-regex
  const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(controlCharRegex, '')
    .replace(/[\u200B-\u200F\u2028-\u202F]/g, '')
    .trim()
    .slice(0, maxLength);
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MULTIPLIER = 2; // Double lockout time after each failure burst

// In-memory rate limit store (resets on cold start)
const loginAttempts = new Map<string, { 
  count: number; 
  firstAttempt: number; 
  lockoutUntil: number;
  lockoutCount: number;
}>();

// =============================================================================
// SECURITY HELPERS
// =============================================================================

/**
 * Clean up old entries periodically
 */
function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, data] of loginAttempts.entries()) {
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW * 4) {
      loginAttempts.delete(ip);
    }
  }
}

/**
 * Check rate limit with progressive lockout
 */
function checkRateLimit(ip: string): { 
  allowed: boolean; 
  remaining: number; 
  resetIn: number;
  lockedOut: boolean;
} {
  cleanupRateLimits();
  const now = Date.now();
  const data = loginAttempts.get(ip);

  // New IP
  if (!data) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW, lockedOut: false };
  }

  // Check if still locked out
  if (data.lockoutUntil > now) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetIn: data.lockoutUntil - now,
      lockedOut: true,
    };
  }

  // Reset if window expired and not locked out
  if (now - data.firstAttempt > RATE_LIMIT_WINDOW && data.lockoutUntil <= now) {
    loginAttempts.set(ip, { count: 0, firstAttempt: now, lockoutUntil: 0, lockoutCount: data.lockoutCount });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW, lockedOut: false };
  }

  // Check if max attempts reached
  if (data.count >= MAX_ATTEMPTS) {
    // Apply progressive lockout
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

/**
 * Record a login attempt
 */
function recordAttempt(ip: string): void {
  const now = Date.now();
  const data = loginAttempts.get(ip);

  if (!data || now - data.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now, lockoutUntil: 0, lockoutCount: 0 });
  } else {
    data.count++;
  }
}

/**
 * Clear rate limit on successful login
 */
function clearRateLimit(ip: string): void {
  loginAttempts.delete(ip);
}

/**
 * Timing-safe password comparison
 */
function verifyPassword(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  
  // Hash both to ensure equal length
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  
  try {
    return timingSafeEqual(providedHash, expectedHash);
  } catch {
    return false;
  }
}

// =============================================================================
// HANDLER
// =============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Add security headers
  addSecurityHeaders(res);
  
  // Handle CORS
  if (!handleCORS(req, res)) return;

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIP = getClientIP(req);

  // Check rate limit
  const rateLimit = checkRateLimit(clientIP);

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_ATTEMPTS.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimit.resetIn / 1000).toString());

  if (!rateLimit.allowed) {
    console.log(JSON.stringify({ 
      event: 'rate_limit', 
      ip: clientIP.slice(0, 16),
      endpoint: 'auth/login',
      lockedOut: rateLimit.lockedOut,
    }));
    
    const minutes = Math.ceil(rateLimit.resetIn / 60000);
    return res.status(429).json({
      error: rateLimit.lockedOut ? 'Account temporarily locked' : 'Too many login attempts',
      message: `Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}`,
      retryAfter: Math.ceil(rateLimit.resetIn / 1000),
    });
  }

  // Check if admin is configured
  if (!ADMIN_PASSWORD || !ADMIN_TOKEN) {
    console.error('Admin credentials not configured');
    return res.status(500).json({ error: 'Admin not configured' });
  }

  try {
    const { password } = req.body;

    // Validate password exists and is a string
    if (!password || typeof password !== 'string') {
      recordAttempt(clientIP);
      console.log(JSON.stringify({ event: 'auth_attempt', ip: clientIP.slice(0, 16), result: 'missing_password' }));
      return res.status(400).json({ error: 'Password is required' });
    }

    // Limit password length to prevent DoS (long input = expensive hash)
    if (password.length > 128) {
      recordAttempt(clientIP);
      console.log(JSON.stringify({ event: 'auth_attempt', ip: clientIP.slice(0, 16), result: 'password_too_long' }));
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Sanitize password (remove control characters)
    const sanitizedPassword = sanitizeString(password, 128);

    // Timing-safe password comparison
    if (!verifyPassword(sanitizedPassword, ADMIN_PASSWORD)) {
      recordAttempt(clientIP);
      console.log(JSON.stringify({ event: 'auth_failure', ip: clientIP.slice(0, 16), endpoint: 'auth/login' }));
      
      // Generic error message (don't reveal if account exists)
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Success - clear rate limit
    clearRateLimit(clientIP);
    console.log(JSON.stringify({ event: 'auth_success', ip: clientIP.slice(0, 16), endpoint: 'auth/login' }));

    // Return the admin token
    return res.status(200).json({
      success: true,
      token: ADMIN_TOKEN,
    });
  } catch (error) {
    console.error('Login error:', error);
    recordAttempt(clientIP);
    return res.status(500).json({ error: 'Login failed' });
  }
}
