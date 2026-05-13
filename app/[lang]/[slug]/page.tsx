import { Metadata } from 'next';
import LocationPage from '@/views/LocationPage';
import { getGeoMetaTags } from '@/lib/geo';
import { LOCATION_SEO_LINKS } from '@/data';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string; slug: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const lang = resolvedParams.lang;

  // Derive specialized geo tags for this location
  const geo = getGeoMetaTags(slug, lang);

  // Fallback title generation if LOCATION_SEO_LINKS fails finding specific info 
  // Normally, our layout.tsx generateMetadata handles the core attributes. 
  // Here we inject the specific geo attributes into the 'other' metadata field for the head.
  
  return {
    other: {
      'geo.position': geo.position,
      'geo.region': geo.region,
      'geo.placename': geo.placename,
      'ICBM': geo.position
    }
  };
}

// Generate static params for all supported locations securely
export function generateStaticParams() {
  const langs = ['he', 'en', 'ar', 'ru'];
  const params: { lang: string; slug: string }[] = [];
  
  for (const location of LOCATION_SEO_LINKS) {
    for (const lang of langs) {
      params.push({
        lang,
        slug: location.slug
      });
    }
  }
  return params;
}

import { Suspense } from 'react';

export default function Page() {
  // Let the client component safely handle mapping the URL parameters
  // Must wrap inside Suspense boundary due to useSearchParams Client-Side Bailout
  return (
    <Suspense fallback={<div>Loading location...</div>}>
      <LocationPage />
    </Suspense>
  );
}
