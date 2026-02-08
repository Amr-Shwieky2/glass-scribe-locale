/**
 * @fileoverview Cloudinary Delete API
 * @description Delete images from Cloudinary (admin only).
 * 
 * BODY:
 * - publicId: The public ID of the image to delete
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
    const { publicId } = req.body;

    if (!publicId || typeof publicId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid publicId' });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return res.status(400).json({
        error: 'Failed to delete image',
        result: result.result,
      });
    }

    return res.status(200).json({
      success: true,
      publicId,
    });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return res.status(500).json({
      error: 'Failed to delete image',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
