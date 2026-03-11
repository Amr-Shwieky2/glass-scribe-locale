/**
 * @fileoverview Cloudinary Images API
 * @description Fetch images from Cloudinary by category or all.
 * HIGH SECURITY: Input validation, rate limiting, query sanitization
 * 
 * QUERY PARAMS:
 * - category: Filter by service category
 * - featured: Filter featured images only
 * - all: Fetch all images across categories
 * - limit: Number of images to return
 * - cursor: Pagination cursor
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import {
  handleCORS,
  addSecurityHeaders,
  getClientIP,
  logSecurityEvent,
  checkRateLimit,
  addRateLimitHeaders,
  RATE_LIMITS,
  sanitizeString,
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

const BASE_FOLDER = process.env.CLOUDINARY_BASE_FOLDER || 'shwaki-glassworks';

const VALID_CATEGORIES = [
  'shower-enclosures',
  'glass-railings',
  'mirrors',
  'storefronts',
  'partitions',
  'lobbies',
  'backsplashes',
  'shelves',
  'glass-doors',
  'hero',
] as const;

type ValidCategory = typeof VALID_CATEGORIES[number];

function isValidCategory(cat: unknown): cat is ValidCategory {
  return typeof cat === 'string' && VALID_CATEGORIES.includes(cat as ValidCategory);
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

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIP = getClientIP(req);

  // Check rate limit
  const rateLimit = checkRateLimit(clientIP, 'api');
  addRateLimitHeaders(res, rateLimit, RATE_LIMITS.api.max);
  
  if (!rateLimit.allowed) {
    logSecurityEvent('rate_limit', clientIP, { endpoint: 'cloudinary/images' });
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const {
      category,
      featured,
      tag,
      all,
      heroPositions,
      serviceCards,
      limit = '50',
      cursor,
    } = req.query as Record<string, string>;

    // Validate and sanitize limit
    const parsedLimit = parseInt(limit, 10);
    const maxResults = Math.min(Math.max(1, parsedLimit || 50), 100);

    // Sanitize cursor if provided
    const sanitizedCursor = cursor ? sanitizeString(cursor, 500) : undefined;

    // Build search expression — use public_id prefix instead of folder
    let expression = `public_id:${BASE_FOLDER}/*`;

    // Filter by category (strict validation)
    if (category && isValidCategory(category)) {
      expression = `public_id:${BASE_FOLDER}/${category}/*`;
    }

    // Filter by featured tag
    if (featured === 'true') {
      expression += ' AND tags=featured';
    }

    // Filter by custom tag (sanitized, only allow specific prefixes)
    if (tag && typeof tag === 'string') {
      const sanitizedTag = sanitizeString(tag, 50).replace(/[^a-zA-Z0-9\-_]/g, '');
      if (sanitizedTag && (sanitizedTag.startsWith('hero-') || sanitizedTag.startsWith('service-card-') || sanitizedTag === 'featured')) {
        expression += ` AND tags=${sanitizedTag}`;
      }
    }

    // Fetch all from all categories (recursive)
    if (all === 'true') {
      expression = `public_id:${BASE_FOLDER}/*`;
      if (tag && typeof tag === 'string') {
        const sanitizedTag = sanitizeString(tag, 50).replace(/[^a-zA-Z0-9\-_]/g, '');
        if (sanitizedTag) {
          expression += ` AND tags=${sanitizedTag}`;
        }
      }
    }

    // Fetch images with hero position tags (hero-1, hero-2, ..., hero-7)
    if (heroPositions === 'true') {
      expression = `public_id:${BASE_FOLDER}/* AND (tags=hero-1 OR tags=hero-2 OR tags=hero-3 OR tags=hero-4 OR tags=hero-5 OR tags=hero-6 OR tags=hero-7)`;
    }

    // Fetch images with service-card-* tags
    if (serviceCards === 'true') {
      expression = `public_id:${BASE_FOLDER}/* AND tags:service-card-*`;
    }

    // Execute search
    const result = await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .next_cursor(sanitizedCursor || undefined)
      .with_field('tags')
      .with_field('context')
      .execute();

    // Set cache headers for public images
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');

    // Return response
    return res.status(200).json({
      resources: result.resources || [],
      next_cursor: result.next_cursor,
      total_count: result.total_count,
    });
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    return res.status(500).json({
      error: 'Failed to fetch images',
    });
  }
}
