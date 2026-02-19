/**
 * @fileoverview Admin Login API
 * @description Simple password authentication for admin panel with rate limiting.
 * 
 * BODY:
 * - password: The admin password
 * 
 * RETURNS:
 * - token: Admin token for authenticated requests
 * 
 * SECURITY:
 * - Rate limiting: 5 attempts per IP per 15 minutes
 * - Timing-safe password comparison
 * - Password hashing with SHA-256
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

// =============================================================================
// CONFIGURATION
// =============================================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

// Clean up old entries periodically
const cleanupRateLimits = () => {
  const now = Date.now();
  for (const [ip, data] of loginAttempts.entries()) {
    if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
      loginAttempts.delete(ip);
    }
  }
};

// Get client IP from request
const getClientIP = (req: VercelRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] as string || 'unknown';
};

// Check rate limit
const checkRateLimit = (ip: string): { allowed: boolean; remaining: number; resetIn: number } => {
  cleanupRateLimits();
  const now = Date.now();
  const data = loginAttempts.get(ip);

  if (!data) {
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW };
  }

  if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetIn: RATE_LIMIT_WINDOW };
  }

  if (data.count >= MAX_ATTEMPTS) {
    const resetIn = RATE_LIMIT_WINDOW - (now - data.firstAttempt);
    return { allowed: false, remaining: 0, resetIn };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - data.count - 1, resetIn: RATE_LIMIT_WINDOW - (now - data.firstAttempt) };
};

// Record login attempt
const recordAttempt = (ip: string): void => {
  const now = Date.now();
  const data = loginAttempts.get(ip);

  if (!data || now - data.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    data.count++;
  }
};

// =============================================================================
// HANDLER
// =============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limit
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP);

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', MAX_ATTEMPTS.toString());
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(rateLimit.resetIn / 1000).toString());

  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'Too many login attempts',
      message: `Please try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes`,
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

    if (!password || typeof password !== 'string') {
      recordAttempt(clientIP);
      return res.status(400).json({ error: 'Password is required' });
    }

    // Limit password length to prevent DoS
    if (password.length > 128) {
      recordAttempt(clientIP);
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Hash the provided password and compare
    const hashedInput = createHash('sha256').update(password).digest('hex');
    const hashedStored = createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

    // Timing-safe comparison
    const inputBuffer = Buffer.from(hashedInput);
    const storedBuffer = Buffer.from(hashedStored);

    if (inputBuffer.length !== storedBuffer.length) {
      recordAttempt(clientIP);
      return res.status(401).json({ error: 'Invalid password' });
    }

    let mismatch = 0;
    for (let i = 0; i < inputBuffer.length; i++) {
      mismatch |= inputBuffer[i] ^ storedBuffer[i];
    }

    if (mismatch !== 0) {
      recordAttempt(clientIP);
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Clear rate limit on successful login
    loginAttempts.delete(clientIP);

    // Return the admin token
    return res.status(200).json({
      success: true,
      token: ADMIN_TOKEN,
    });
  } catch (error) {
    console.error('Login error:', error);
    recordAttempt(clientIP);
    return res.status(500).json({
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
