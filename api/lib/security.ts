/**
 * Security utilities for API endpoints
 * Provides input validation, sanitization, and rate limiting helpers
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// =============================================================================
// INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
export function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  
  // eslint-disable-next-line no-control-regex
  const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(controlCharRegex, '') // Remove control characters
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
  
  // Allow configured origins
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return false; // Indicates request was handled
  }
  
  return true; // Continue processing
}

// =============================================================================
// LOGGING (sanitized)
// =============================================================================

/**
 * Log security-related events (without sensitive data)
 */
export function logSecurityEvent(
  event: 'auth_attempt' | 'auth_success' | 'auth_failure' | 'rate_limit' | 'invalid_input',
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
