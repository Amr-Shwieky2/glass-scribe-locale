/**
 * CSRF Token Generation Endpoint
 * Generates secure CSRF tokens for form protection
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleCORS,
  validateMethod,
  addSecurityHeaders,
  getClientIP,
  checkRateLimit,
  addRateLimitHeaders,
  generateCSRFToken,
  getCSRFCookieOptions,
  RATE_LIMITS,
} from '../lib/security';

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
