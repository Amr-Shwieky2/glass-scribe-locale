import { NextResponse } from 'next/server';
import { issueCsrfToken } from '@/lib/csrf';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = issueCsrfToken();
  if (!token) {
    // Fail closed: no secret → no tokens → the contact form can't be abused
    console.error('[csrf] CSRF_SECRET is missing or shorter than 32 characters');
    return NextResponse.json({ error: 'Not configured' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json({ token }, { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } });
}
