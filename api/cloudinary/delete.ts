/**
 * @fileoverview Cloudinary Delete API
 * @description Delete images from Cloudinary (admin only).
 * HIGH SECURITY: Timing-safe auth, input validation, rate limiting
 * 
 * BODY:
 * - publicId: The public ID of the image to delete
 * 
 * HEADERS:
 * - Authorization: Bearer <admin_token>
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import { timingSafeEqual, createHash } from 'crypto';

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

function secureCompare(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  try { return timingSafeEqual(providedHash, expectedHash); } catch { return false; }
}

function verifyAdminAuth(req: VercelRequest): boolean {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  if (!ADMIN_TOKEN) return false;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  if (!token || token.length > 256) return false;
  return secureCompare(token, ADMIN_TOKEN);
}

function sanitizePublicId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const sanitized = input.replace(/[^a-zA-Z0-9\-_/]/g, '');
  if (sanitized.length < 1 || sanitized.length > 500) return null;
  if (sanitized.includes('..')) return null;
  return sanitized;
}

const SUSPICIOUS_PATTERNS = [
  /(<script|<\/script|javascript:|data:|vbscript:)/gi,
  /(\$\{|\{\{|<%|%>|<\?)/gi,
  /(union\s+select|drop\s+table|delete\s+from|insert\s+into)/gi,
  /(\.\.[\\/]|\x00)/gi,
];

function detectSuspiciousInput(input: string): boolean {
  if (typeof input !== 'string') return false;
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
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

// =============================================================================
// CONFIGURATION
// =============================================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
  const rateLimit = checkRateLimit(clientIP, 'api');
  addRateLimitHeaders(res, rateLimit, RATE_LIMITS.api.max);
  
  if (!rateLimit.allowed) {
    console.log(JSON.stringify({ event: 'rate_limit', ip: clientIP.slice(0, 16), endpoint: 'cloudinary/delete' }));
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Verify admin authentication (timing-safe)
  if (!verifyAdminAuth(req)) {
    console.log(JSON.stringify({ event: 'auth_failure', ip: clientIP.slice(0, 16), endpoint: 'cloudinary/delete' }));
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { publicId } = req.body;

    // Detect suspicious input patterns
    if (typeof publicId === 'string' && detectSuspiciousInput(publicId)) {
      console.log(JSON.stringify({ event: 'suspicious_input', ip: clientIP.slice(0, 16), endpoint: 'cloudinary/delete' }));
      return res.status(400).json({ error: 'Invalid input detected' });
    }

    // Validate and sanitize publicId
    const sanitizedPublicId = sanitizePublicId(publicId);
    if (!sanitizedPublicId) {
      return res.status(400).json({ error: 'Missing or invalid publicId' });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(sanitizedPublicId);

    if (result.result !== 'ok') {
      return res.status(400).json({
        error: 'Failed to delete image',
        result: result.result,
      });
    }

    console.log(JSON.stringify({ event: 'auth_success', ip: clientIP.slice(0, 16), action: 'delete', publicId: sanitizedPublicId }));

    return res.status(200).json({
      success: true,
      publicId: sanitizedPublicId,
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return res.status(500).json({
      error: 'Failed to delete image',
    });
  }
}
