/**
 * Security utilities for API endpoints
 * Provides input validation, sanitization, rate limiting, and security helpers
 * HIGH SECURITY IMPLEMENTATION
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual, createHash, randomBytes } from 'crypto';

// =============================================================================
// SECURITY CONSTANTS
// =============================================================================

/** Maximum request body size in bytes */
export const MAX_BODY_SIZE = 10240; // 10KB

/** Rate limit configuration */
export const RATE_LIMITS = {
  login: { window: 15 * 60 * 1000, max: 5 },     // 5 attempts per 15 minutes
  contact: { window: 60 * 1000, max: 3 },        // 3 requests per minute
  api: { window: 60 * 1000, max: 30 },           // 30 requests per minute
} as const;

/** Suspicious patterns for detection */
const SUSPICIOUS_PATTERNS = [
  /(<script|<\/script|javascript:|data:|vbscript:)/gi,
  /(\$\{|\{\{|<%|%>|<\?)/gi,  // Template injection
  /(union\s+select|drop\s+table|delete\s+from|insert\s+into)/gi,  // SQL injection
  /(\.\.[\/\\]|\x00)/gi,  // Path traversal & null bytes
];

// =============================================================================
// INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize string input to prevent XSS and injection attacks
 * @param input - Raw input to sanitize
 * @param maxLength - Maximum allowed length (default 1000)
 * @returns Sanitized string
 */
export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  if (input.length > maxLength * 2) return ''; // Reject extremely long inputs early
  
  // eslint-disable-next-line no-control-regex
  const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  
  return input
    .replace(/<[^>]*>/g, '')           // Remove HTML tags
    .replace(/javascript:/gi, '')       // Remove javascript: URLs
    .replace(/data:/gi, '')             // Remove data: URLs
    .replace(/vbscript:/gi, '')         // Remove vbscript: URLs
    .replace(/on\w+\s*=/gi, '')         // Remove event handlers
    .replace(/expression\s*\(/gi, '')   // Remove CSS expressions
    .replace(controlCharRegex, '')       // Remove control characters
    .replace(/[\u200B-\u200F\u2028-\u202F]/g, '') // Remove zero-width chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate and sanitize public ID (Cloudinary format)
 */
export function sanitizePublicId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  
  // Public ID should only contain alphanumeric, hyphens, underscores, slashes
  const sanitized = input.replace(/[^a-zA-Z0-9\-_/]/g, '');
  
  // Basic validation
  if (sanitized.length < 1 || sanitized.length > 500) return null;
  if (sanitized.includes('..')) return null; // Prevent path traversal
  
  return sanitized;
}

/**
 * Validate tag name
 */
export function sanitizeTag(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  
  // Tags should only contain alphanumeric, hyphens, underscores
  const sanitized = input.replace(/[^a-zA-Z0-9\-_]/g, '');
  
  if (sanitized.length < 1 || sanitized.length > 100) return null;
  
  return sanitized;
}

// =============================================================================
// CRYPTOGRAPHIC SECURITY
// =============================================================================

/**
 * Timing-safe token comparison to prevent timing attacks
 * @param provided - Token provided by client
 * @param expected - Expected token (from env)
 * @returns true if tokens match
 */
export function secureCompare(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  if (typeof provided !== 'string' || typeof expected !== 'string') return false;
  
  // Hash both to ensure equal length comparison
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  
  try {
    return timingSafeEqual(providedHash, expectedHash);
  } catch {
    return false;
  }
}

/**
 * Generate a secure random token
 * @param length - Token length in bytes (default 32)
 * @returns Hex-encoded random token
 */
export function generateSecureToken(length = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Hash sensitive data (like passwords)
 * @param data - Data to hash
 * @returns SHA-256 hash
 */
export function hashData(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

/**
 * Detect suspicious patterns in input (potential attacks)
 * @param input - Input string to check
 * @returns true if suspicious patterns detected
 */
export function detectSuspiciousInput(input: string): boolean {
  if (typeof input !== 'string') return false;
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
}

// =============================================================================
// REQUEST VALIDATION
// =============================================================================

/**
 * Validate request method
 */
export function validateMethod(
  req: VercelRequest,
  res: VercelResponse,
  allowedMethods: string[]
): boolean {
  if (!allowedMethods.includes(req.method || '')) {
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  return true;
}

/**
 * Validate content type for POST/PUT requests
 */
export function validateContentType(
  req: VercelRequest,
  res: VercelResponse
): boolean {
  if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/json')) {
      res.status(415).json({ error: 'Content-Type must be application/json' });
      return false;
    }
  }
  return true;
}

/**
 * Validate request body size (basic check)
 */
export function validateBodySize(
  req: VercelRequest,
  res: VercelResponse,
  maxSize = 10240 // 10KB default
): boolean {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > maxSize) {
    res.status(413).json({ error: 'Request body too large' });
    return false;
  }
  return true;
}

// =============================================================================
// CLIENT IP EXTRACTION
// =============================================================================

/**
 * Get client IP from request headers
 */
export function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return (req.headers['x-real-ip'] as string) || 'unknown';
}

// =============================================================================
// ERROR RESPONSES
// =============================================================================

/**
 * Send a standardized error response
 */
export function sendError(
  res: VercelResponse,
  status: number,
  message: string,
  details?: Record<string, unknown>
): void {
  res.status(status).json({
    error: message,
    ...(details && { details }),
  });
}

/**
 * Send a standardized success response
 */
export function sendSuccess(
  res: VercelResponse,
  data: Record<string, unknown>,
  status = 200
): void {
  res.status(status).json({
    success: true,
    ...data,
  });
}

// =============================================================================
// CORS HANDLING
// =============================================================================

const ALLOWED_ORIGINS = [
  'https://shwakiglassworks.com',
  'https://www.shwakiglassworks.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean);

/**
 * Handle CORS preflight and validation
 */
export function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  
  // Allow configured origins only
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false; // Indicates request was handled
  }
  
  return true; // Continue processing
}

// =============================================================================
// ADMIN AUTHENTICATION
// =============================================================================

/**
 * Verify admin authentication token (timing-safe)
 * @param req - Vercel request
 * @returns true if authenticated
 */
export function verifyAdminAuth(req: VercelRequest): boolean {
  const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
  if (!ADMIN_TOKEN) return false;
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  
  const token = authHeader.substring(7);
  if (!token || token.length > 256) return false; // Reject oversized tokens
  
  return secureCompare(token, ADMIN_TOKEN);
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(res: VercelResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
}

// =============================================================================
// LOGGING (sanitized)
// =============================================================================

/**
 * Log security-related events (without sensitive data)
 */
export function logSecurityEvent(
  event: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'rate_limit' | 'invalid_input' | 'suspicious_input' | 'blocked',
  ip: string,
  details?: Record<string, unknown>
): void {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ip: ip.slice(0, 16), // Truncate for privacy
    ...details,
  }));
}

// =============================================================================
// RATE LIMITING
// =============================================================================

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check and update rate limit for an IP
 * @param ip - Client IP address
 * @param type - Type of rate limit to apply
 * @returns Object with allowed status and remaining attempts
 */
export function checkRateLimit(
  ip: string,
  type: keyof typeof RATE_LIMITS = 'api'
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[type];
  const key = `${type}:${ip}`;
  const now = Date.now();
  
  // Clean up old entries periodically
  if (Math.random() < 0.1) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetTime) rateLimitStore.delete(k);
    }
  }
  
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.window });
    return { allowed: true, remaining: config.max - 1, resetIn: config.window };
  }
  
  if (record.count >= config.max) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }
  
  record.count++;
  return { allowed: true, remaining: config.max - record.count, resetIn: record.resetTime - now };
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  res: VercelResponse,
  limit: { remaining: number; resetIn: number },
  max: number
): void {
  res.setHeader('X-RateLimit-Limit', max.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit.remaining).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(limit.resetIn / 1000).toString());
}

// =============================================================================
// INPUT VALIDATION
// =============================================================================

/**
 * Validate email format (strict)
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format
 */
export function isValidPhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  return phoneRegex.test(phone);
}
