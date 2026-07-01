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

const BASE_FOLDER = process.env.CLOUDINARY_BASE_FOLDER || 'shwaki-glassworks';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const cursor = searchParams.get('cursor');
    const tag = searchParams.get('tag');
    const heroPositions = searchParams.get('heroPositions');
    const serviceCards = searchParams.get('serviceCards');

    // Build Cloudinary search expression (priority-based, most specific first)
    let expression = `public_id:${BASE_FOLDER}/*`;
    if (heroPositions === 'true') {
      // Return only images tagged as hero positions (hero-1 through hero-7)
      expression = `public_id:${BASE_FOLDER}/* AND (tags=hero-1 OR tags=hero-2 OR tags=hero-3 OR tags=hero-4 OR tags=hero-5 OR tags=hero-6 OR tags=hero-7)`;
    } else if (serviceCards === 'true') {
      // Return only images with a service-card-{serviceId} tag (prefix match)
      expression = `public_id:${BASE_FOLDER}/* AND tags:service-card-*`;
    } else if (tag) {
      // Exact tag match
      expression = `public_id:${BASE_FOLDER}/* AND tags=${tag}`;
    } else if (category) {
      expression = `public_id:${BASE_FOLDER}/${category}/*`;
      if (featured === 'true') expression += ' AND tags=featured';
    } else if (featured === 'true') {
      expression += ' AND tags=featured';
    }
    // When none of the above specific filters apply, the base expression covers all images

    let search = cld.search
      .expression(expression)
      .sort_by('created_at', 'desc')
      .max_results(limit)
      .with_field('tags')
      .with_field('context');

    if (cursor) search = search.next_cursor(cursor);

    const result = await search.execute();

    return NextResponse.json({
      resources: result.resources || [],
      next_cursor: result.next_cursor,
      total_count: result.total_count,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}
