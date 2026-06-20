import { NextResponse } from 'next/server';

export const revalidate = 86400; // refresh once per day

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('reviews_sort', 'newest');
    // Fetch reviews in all supported languages — Google returns the most relevant
    url.searchParams.set('language', 'iw'); // Hebrew as primary; reviews come in original language

    const res = await fetch(url.toString(), {
      next: { revalidate: 86400 },
    });

    if (!res.ok) throw new Error(`Google API HTTP ${res.status}`);

    const data = await res.json();
    if (data.status !== 'OK') throw new Error(`Google Places status: ${data.status}`);

    return NextResponse.json({
      rating: data.result.rating as number,
      total: data.result.user_ratings_total as number,
      reviews: (data.result.reviews ?? []) as GooglePlaceReview[],
    });
  } catch (err) {
    console.error('[/api/reviews]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export interface GooglePlaceReview {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}
