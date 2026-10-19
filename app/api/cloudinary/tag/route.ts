import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/admin-session';
import { cloudinary, isAllowedTag, isOwnPublicId, revalidateImages } from '@/lib/cloudinary/server';

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { publicId, tag, action } = body as { publicId?: unknown; tag?: unknown; action?: unknown };

  if (!isOwnPublicId(publicId)) return NextResponse.json({ error: 'Invalid publicId' }, { status: 400 });
  if (typeof tag !== 'string' || !isAllowedTag(tag)) return NextResponse.json({ error: 'Invalid tag' }, { status: 400 });
  if (action !== 'add' && action !== 'remove') return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  try {
    const result = action === 'add'
      ? await cloudinary.uploader.add_tag(tag, [publicId])
      : await cloudinary.uploader.remove_tag(tag, [publicId]);
    revalidateImages();
    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to update tags' }, { status: 500 });
  }
}
