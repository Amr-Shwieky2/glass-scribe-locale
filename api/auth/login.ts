/**
 * @fileoverview Admin Login API
 * @description Simple password authentication for admin panel.
 * 
 * BODY:
 * - password: The admin password
 * 
 * RETURNS:
 * - token: Admin token for authenticated requests
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash } from 'crypto';

// =============================================================================
// CONFIGURATION
// =============================================================================

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

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

  // Check if admin is configured
  if (!ADMIN_PASSWORD || !ADMIN_TOKEN) {
    console.error('Admin credentials not configured');
    return res.status(500).json({ error: 'Admin not configured' });
  }

  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Hash the provided password and compare
    const hashedInput = createHash('sha256').update(password).digest('hex');
    const hashedStored = createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

    // Timing-safe comparison
    const inputBuffer = Buffer.from(hashedInput);
    const storedBuffer = Buffer.from(hashedStored);

    if (inputBuffer.length !== storedBuffer.length) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    let mismatch = 0;
    for (let i = 0; i < inputBuffer.length; i++) {
      mismatch |= inputBuffer[i] ^ storedBuffer[i];
    }

    if (mismatch !== 0) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Return the admin token
    return res.status(200).json({
      success: true,
      token: ADMIN_TOKEN,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
