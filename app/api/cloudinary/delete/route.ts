import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import cloud from 'cloudinary';

const cld = cloud.v2;
cld.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function checkAuth(req: NextRequest): boolean {
  const h = req.headers.get('authorization');
  if (!h || !h.startsWith('Bearer ')) return false;
  return h.substring(7) === process.env.ADMIN_TOKEN;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const publicId = body.publicId;

    if (!publicId) return NextResponse.json({ error: 'Missing publicId' }, { status: 400 });

    const result = await cld.uploader.destroy(publicId);
    if (result.result !== 'ok') return NextResponse.json({ error: 'Failed to delete', result: result.result }, { status: 400 });

    return NextResponse.json({ success: true, publicId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
