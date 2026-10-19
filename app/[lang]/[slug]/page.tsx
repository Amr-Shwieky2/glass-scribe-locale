import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationPage from '@/views/LocationPage';
import ServiceDetail from '@/views/ServiceDetail';
import { getGeoMetaTags } from '@/lib/geo';
import { assertLocale, LOCALES } from '@/lib/i18n';
import { SERVICE_SEO_PAGES, getServiceSeoPageBySlug } from '@/data/service-seo-content';
import { LOCATION_SLUGS, getLocation, hasLocationPage } from '@/data/locations';
import { getLocalizedText } from '@/data';
import { buildPageMetadata, getLocationSeo } from '@/data/seo';

type Props = { params: Promise<{ lang: string; slug: string }> };

// Only location pages and service landing pages exist under /[lang]/[slug]
export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = [...LOCATION_SLUGS, ...SERVICE_SEO_PAGES.map((s) => s.slug)];
  return LOCALES.flatMap((lang) => slugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = assertLocale(lang);

  // Service SEO landing pages (e.g. /he/glass-shower-installation)
  const servicePage = getServiceSeoPageBySlug(slug);
  if (servicePage) {
    return buildPageMetadata(locale, `/${servicePage.slug}`, {
      title: getLocalizedText(servicePage.metaTitle, locale),
      description: getLocalizedText(servicePage.metaDescription, locale),
      keywords: getLocalizedText(servicePage.keywords, locale),
    });
  }

  const location = getLocation(slug);
  if (!location) notFound();

  const geo = getGeoMetaTags(slug, locale);
  return {
    ...buildPageMetadata(locale, `/${slug}`, getLocationSeo(locale, getLocalizedText(location.name, locale))),
    other: {
      'geo.position': geo.position,
      'geo.region': geo.region,
      'geo.placename': geo.placename,
      'ICBM': geo.position,
    },
  };
}

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const locale = assertLocale(lang);

  const servicePage = getServiceSeoPageBySlug(slug);
  if (servicePage) return <ServiceDetail locale={locale} service={servicePage} />;

  if (!hasLocationPage(slug)) notFound();
  return <LocationPage locale={locale} slug={slug} />;
}
