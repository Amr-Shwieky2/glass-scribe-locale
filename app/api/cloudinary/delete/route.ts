import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/admin-session';
import { cloudinary, isOwnPublicId, revalidateImages } from '@/lib/cloudinary/server';

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const publicId = (body as { publicId?: unknown }).publicId;
  if (!isOwnPublicId(publicId)) return NextResponse.json({ error: 'Invalid publicId' }, { status: 400 });

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok') return NextResponse.json({ error: 'Failed to delete', result: result.result }, { status: 400 });
    revalidateImages();
    return NextResponse.json({ success: true, publicId }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
