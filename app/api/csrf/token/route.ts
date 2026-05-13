import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomBytes, createHmac } from 'crypto';

const CSRF_SECRET = process.env.ADMIN_TOKEN || 'fallback_secret_for_csrf';

export async function GET(req: NextRequest) {
  // Generate a random token
  const token = randomBytes(32).toString('hex');
  
  // Create an HMAC signature
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(token)
    .digest('hex');
    
  return NextResponse.json({
    token: `${token}.${signature}`
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
