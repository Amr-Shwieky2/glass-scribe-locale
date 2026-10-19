import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/admin-session';

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  clearAdminSession(res);
  return res;
}
