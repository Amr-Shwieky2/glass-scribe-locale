/**
 * Google Places — single source of truth for the business rating.
 *
 * Server-only (reads GOOGLE_PLACES_API_KEY). The fetch is cached by Next.js for
 * 24h, so JSON-LD, meta descriptions and /api/reviews all share one upstream call
 * per day. When the API is not configured or fails, callers get `null` and must
 * omit rating data instead of falling back to hardcoded numbers.
 */

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

export interface GooglePlaceData {
  rating: number;
  total: number;
  reviews: GooglePlaceReview[];
}

export interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
}

const DAY = 86400;

export async function getGooglePlaceData(): Promise<GooglePlaceData | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
    url.searchParams.set('place_id', placeId);
    url.searchParams.set('fields', 'name,rating,user_ratings_total,reviews');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('reviews_sort', 'newest');
    // Hebrew as primary; reviews come back in their original language
    url.searchParams.set('language', 'iw');

    const res = await fetch(url.toString(), { next: { revalidate: DAY, tags: ['google-reviews'] } });
    if (!res.ok) throw new Error(`Google API HTTP ${res.status}`);

    const data = await res.json();
    if (data.status !== 'OK') throw new Error(`Google Places status: ${data.status}`);

    const rating = Number(data.result?.rating);
    const total = Number(data.result?.user_ratings_total);
    if (!Number.isFinite(rating) || !Number.isFinite(total) || rating <= 0 || total <= 0) return null;

    return {
      rating,
      total,
      reviews: (data.result.reviews ?? []) as GooglePlaceReview[],
    };
  } catch (err) {
    console.error('[google-places]', err);
    return null;
  }
}

/** Live rating for JSON-LD / descriptions, or null when unavailable. */
export async function getAggregateRating(): Promise<AggregateRating | null> {
  const data = await getGooglePlaceData();
  return data ? { ratingValue: data.rating, reviewCount: data.total } : null;
}

/** schema.org AggregateRating node, or undefined so JSON.stringify drops the key. */
export function toAggregateRatingSchema(rating: AggregateRating | null) {
  if (!rating) return undefined;
  return {
    '@type': 'AggregateRating',
    ratingValue: rating.ratingValue.toFixed(1),
    reviewCount: String(rating.reviewCount),
    bestRating: '5',
  };
}
