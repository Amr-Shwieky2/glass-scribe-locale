/**
 * @fileoverview Cloudinary Tag API
 * @description Add or remove tags from images (admin only).
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

// =============================================================================
// CONFIGURATION
// =============================================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

// =============================================================================
// AUTH HELPER
// =============================================================================

function verifyAuth(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === ADMIN_TOKEN;
}

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

  // Verify admin authentication
  if (!verifyAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { publicId, tag, action } = req.body;

    // Validate inputs
    if (!publicId || typeof publicId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid publicId' });
    }

    if (!tag || typeof tag !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid tag' });
    }

    if (!action || !['add', 'remove'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "add" or "remove"' });
    }

    // Add or remove tag
    let result;
    if (action === 'add') {
      result = await cloudinary.uploader.add_tag(tag, [publicId]);
    } else {
      result = await cloudinary.uploader.remove_tag(tag, [publicId]);
    }

    return res.status(200).json({
      success: true,
      publicId,
      tag,
      action,
      result,
    });
  } catch (error) {
    console.error('Cloudinary tag error:', error);
    return res.status(500).json({
      error: 'Failed to update tag',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
