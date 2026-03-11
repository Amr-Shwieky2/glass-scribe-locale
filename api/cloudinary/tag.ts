/**
 * @fileoverview Cloudinary Tag API
 * @description Add or remove tags from images (admin only).
 * HIGH SECURITY: Timing-safe auth, input validation, rate limiting
 * 
 * BODY:
 * - publicId: The public ID of the image
 * - tag: The tag to add or remove
 * - action: 'add' or 'remove'
 * 
 * HEADERS:
 * - Authorization: Bearer <admin_token>
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import {
  verifyAdminAuth,
  sanitizePublicId,
  sanitizeTag,
  handleCORS,
  addSecurityHeaders,
  getClientIP,
  logSecurityEvent,
  checkRateLimit,
  addRateLimitHeaders,
  RATE_LIMITS,
  detectSuspiciousInput,
} from '../lib/security';

// =============================================================================
// CONFIGURATION
// =============================================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Allowed tag prefixes for safety
const ALLOWED_TAG_PREFIXES = ['hero-', 'service-card-', 'featured'];

function isAllowedTag(tag: string): boolean {
  return ALLOWED_TAG_PREFIXES.some(prefix => tag === prefix || tag.startsWith(prefix));
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
  const rateLimit = checkRateLimit(clientIP, 'api');
  addRateLimitHeaders(res, rateLimit, RATE_LIMITS.api.max);
  
  if (!rateLimit.allowed) {
    logSecurityEvent('rate_limit', clientIP, { endpoint: 'cloudinary/tag' });
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Verify admin authentication (timing-safe)
  if (!verifyAdminAuth(req)) {
    logSecurityEvent('auth_failure', clientIP, { endpoint: 'cloudinary/tag' });
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { publicId, tag, action } = req.body;

    // Detect suspicious input patterns
    const inputs = [publicId, tag].filter(x => typeof x === 'string').join(' ');
    if (detectSuspiciousInput(inputs)) {
      logSecurityEvent('suspicious_input', clientIP, { endpoint: 'cloudinary/tag' });
      return res.status(400).json({ error: 'Invalid input detected' });
    }

    // Validate and sanitize inputs
    const sanitizedPublicId = sanitizePublicId(publicId);
    if (!sanitizedPublicId) {
      return res.status(400).json({ error: 'Missing or invalid publicId' });
    }

    const sanitizedTag = sanitizeTag(tag);
    if (!sanitizedTag) {
      return res.status(400).json({ error: 'Missing or invalid tag' });
    }

    // Validate tag is in allowed list
    if (!isAllowedTag(sanitizedTag)) {
      logSecurityEvent('invalid_input', clientIP, { endpoint: 'cloudinary/tag', tag: sanitizedTag });
      return res.status(400).json({ error: 'Tag not allowed' });
    }

    if (!action || !['add', 'remove'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "add" or "remove"' });
    }

    // Add or remove tag
    let result;
    if (action === 'add') {
      result = await cloudinary.uploader.add_tag(sanitizedTag, [sanitizedPublicId]);
    } else {
      result = await cloudinary.uploader.remove_tag(sanitizedTag, [sanitizedPublicId]);
    }

    logSecurityEvent('auth_success', clientIP, { action: `tag_${action}`, tag: sanitizedTag });

    return res.status(200).json({
      success: true,
      publicId: sanitizedPublicId,
      tag: sanitizedTag,
      action,
      result,
    });
  } catch (error) {
    console.error('Cloudinary tag error:', error);
    return res.status(500).json({
      error: 'Failed to update tag',
    });
  }
}
}
