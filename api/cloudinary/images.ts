/**
 * @fileoverview Cloudinary Images API
 * @description Fetch images from Cloudinary by category or all.
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
];

// =============================================================================
// HANDLER
// =============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      category,
      featured,
      all,
      limit = '50',
      cursor,
    } = req.query as Record<string, string>;

    const maxResults = Math.min(parseInt(limit, 10) || 50, 100);

    // Build search expression
    let expression = `folder:${BASE_FOLDER}/*`;

    // Filter by category
    if (category && VALID_CATEGORIES.includes(category)) {
      expression = `folder:${BASE_FOLDER}/${category}`;
    }

    // Filter by featured tag
    if (featured === 'true') {
      expression += ' AND tags=featured';
    }

    // Fetch all from all categories (recursive)
    if (all === 'true') {
      expression = `folder:${BASE_FOLDER}/**`;
    }

    // Execute search
    const result = await cloudinary.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(maxResults)
      .next_cursor(cursor || undefined)
      .with_field('tags')
      .with_field('context')
      .execute();

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
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
