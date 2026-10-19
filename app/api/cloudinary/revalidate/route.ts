import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/admin-session';
import { revalidateImages } from '@/lib/cloudinary/server';

/** Called by the admin UI after the Cloudinary upload widget finishes. */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  revalidateImages();
  return NextResponse.json({ success: true }, { status: 200 });
}
