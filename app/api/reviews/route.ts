import { NextResponse } from 'next/server';
import { getGooglePlaceData } from '@/lib/google-places';

export const revalidate = 86400; // refresh once per day

export async function GET() {
  if (!process.env.GOOGLE_PLACES_API_KEY || !process.env.GOOGLE_PLACE_ID) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const data = await getGooglePlaceData();
  if (!data) {
    // Details are logged server-side in getGooglePlaceData — never leak them to the client
    return NextResponse.json({ error: 'Reviews are temporarily unavailable' }, { status: 502 });
  }

  return NextResponse.json(data);
}

export type { GooglePlaceReview } from '@/lib/google-places';
