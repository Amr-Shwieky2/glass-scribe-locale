import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/admin-session';

/** Lets the admin UI know whether its httpOnly session cookie is still valid. */
export async function GET(req: NextRequest) {
  const session = getAdminSession(req);
  return NextResponse.json(
    session ? { authenticated: true, expiresAt: session.expiresAt } : { authenticated: false },
    { status: 200, headers: { 'Cache-Control': 'no-store' } }
  );
}
