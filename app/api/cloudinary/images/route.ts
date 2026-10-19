import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ALLOWED_CATEGORY_FOLDERS,
  isAllowedTag,
  isValidCursor,
  searchImages,
  type ImageQuery,
} from '@/lib/cloudinary/server';

/**
 * Public image listing (used by the admin dashboard; public pages fetch on the
 * server). Every user-supplied value is whitelisted before it reaches the
 * Cloudinary search expression; anything else is a 400. Results are served
 * from the shared 1h cache.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const cursor = searchParams.get('cursor');
  const featured = searchParams.get('featured') === 'true';
  const limitRaw = searchParams.get('limit') ?? '50';

  if (!/^\d{1,3}$/.test(limitRaw)) return badRequest('Invalid limit');
  const limit = Math.min(Math.max(parseInt(limitRaw, 10), 1), 100);

  if (category !== null && !ALLOWED_CATEGORY_FOLDERS.has(category)) return badRequest('Invalid category');
  if (tag !== null && !isAllowedTag(tag)) return badRequest('Invalid tag');
  if (cursor !== null && !isValidCursor(cursor)) return badRequest('Invalid cursor');

  let query: ImageQuery;
  if (searchParams.get('heroPositions') === 'true') query = { kind: 'heroPositions' };
  else if (searchParams.get('serviceCards') === 'true') query = { kind: 'serviceCards' };
  else if (tag) query = { kind: 'tag', tag };
  else if (category) query = { kind: 'category', folder: category, featured };
  else if (featured) query = { kind: 'featured' };
  else query = { kind: 'all' };

  try {
    const result = await searchImages(query, limit, cursor ?? undefined);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}
