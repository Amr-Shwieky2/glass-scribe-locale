import { Metadata } from 'next';
import LocationPage from '@/views/LocationPage';
import ServiceDetail from '@/views/ServiceDetail';
import { getGeoMetaTags } from '@/lib/geo';
import { LOCATION_SEO_LINKS } from '@/data';
import { SERVICE_SEO_PAGES, getServiceSeoPageBySlug } from '@/data/service-seo-content';
import { getLocalizedText, type SupportedLocale } from '@/data';

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const lang = resolvedParams.lang as SupportedLocale;

  // Service SEO landing pages (e.g. /he/glass-shower-installation) get their own title/description
  const servicePage = getServiceSeoPageBySlug(slug);
  if (servicePage) {
    const title = getLocalizedText(servicePage.metaTitle, lang);
    const description = getLocalizedText(servicePage.metaDescription, lang);
    return {
      title,
      description,
      keywords: getLocalizedText(servicePage.keywords, lang),
      alternates: {
        canonical: `https://www.shwakiglassworks.com/${lang}/${servicePage.slug}`,
      },
      openGraph: {
        title,
        description,
        type: 'article',
      },
    };
  }

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

// Generate static params for all supported locations and service SEO pages
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

  for (const service of SERVICE_SEO_PAGES) {
    for (const lang of langs) {
      params.push({
        lang,
        slug: service.slug
      });
    }
  }
  return params;
}

import { Suspense } from 'react';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  const isServicePage = !!getServiceSeoPageBySlug(slug);

  // Let the client component safely handle mapping the URL parameters
  // Must wrap inside Suspense boundary due to useSearchParams Client-Side Bailout
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {isServicePage ? <ServiceDetail /> : <LocationPage />}
    </Suspense>
  );
}
