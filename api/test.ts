import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // Test 1: Basic response
    const step1 = 'Basic OK';
    
    // Test 2: Check env vars
    const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME;
    const hasApiKey = !!process.env.CLOUDINARY_API_KEY;
    const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET;
    
    // Test 3: Try importing cloudinary
    let cloudinaryOK = false;
    let cloudinaryError = null;
    try {
      const { v2: cloudinary } = await import('cloudinary');
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
      });
      cloudinaryOK = true;
    } catch (e) {
      cloudinaryError = e instanceof Error ? e.message : String(e);
    }
    
    // Test 4: Crypto
    let cryptoOK = false;
    let cryptoError = null;
    try {
      const { createHash } = await import('crypto');
      const hash = createHash('sha256').update('test').digest('hex');
      cryptoOK = hash.length > 0;
    } catch (e) {
      cryptoError = e instanceof Error ? e.message : String(e);
    }
    
    return res.status(200).json({
      step1,
      env: { hasCloudName, hasApiKey, hasApiSecret },
      cloudinary: { ok: cloudinaryOK, error: cloudinaryError },
      crypto: { ok: cryptoOK, error: cryptoError },
      status: 'All systems operational',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Handler error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
