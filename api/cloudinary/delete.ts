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
import {
  verifyAdminAuth,
  sanitizePublicId,
  handleCORS,
  addSecurityHeaders,
  getClientIP,
  logSecurityEvent,
  checkRateLimit,
  addRateLimitHeaders,
  RATE_LIMITS,
  detectSuspiciousInput,
} from '../security';

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
    logSecurityEvent('rate_limit', clientIP, { endpoint: 'cloudinary/delete' });
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Verify admin authentication (timing-safe)
  if (!verifyAdminAuth(req)) {
    logSecurityEvent('auth_failure', clientIP, { endpoint: 'cloudinary/delete' });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { publicId } = req.body;

    // Detect suspicious input patterns
    if (typeof publicId === 'string' && detectSuspiciousInput(publicId)) {
      logSecurityEvent('suspicious_input', clientIP, { endpoint: 'cloudinary/delete' });
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

    logSecurityEvent('auth_success', clientIP, { action: 'delete', publicId: sanitizedPublicId });

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
