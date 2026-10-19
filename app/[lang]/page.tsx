import type { Metadata } from 'next';
import Home from '@/views/Home';
import { assertLocale } from '@/lib/i18n';
import { getAggregateRating } from '@/lib/google-places';
import { getHeroImages, getServiceCardImageIds } from '@/lib/cloudinary/server';
import { getThumbnailUrl } from '@/lib/cloudinary/urls';
import { SERVICES } from '@/data';
import { buildPageMetadata, getHomeSeo } from '@/data/seo';
import { buildHomeFaqSchema } from '@/data/faq';
import { SHOW_FAQ_SECTIONS } from '@/data/site-features';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocale((await params).lang);
  const rating = await getAggregateRating();
  return buildPageMetadata(locale, '', getHomeSeo(locale, rating));
}

export default async function Page({ params }: Props) {
  const locale = assertLocale((await params).lang);
  const [heroImages, cardIds] = await Promise.all([getHeroImages(), getServiceCardImageIds()]);

  const serviceCardImages: Record<string, string> = {};
  for (const service of SERVICES) {
    const id = cardIds[service.id];
    const url = id ? getThumbnailUrl(id, 600) : service.image;
    if (url) serviceCardImages[service.id] = url;
  }

  return (
    <>
      {/* FAQPage markup only alongside the visible FAQ section (Google requires them to match) */}
      {SHOW_FAQ_SECTIONS && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildHomeFaqSchema(locale)) }} />
      )}
      <Home locale={locale} heroImageId={heroImages[0]?.public_id} serviceCardImages={serviceCardImages} />
    </>
  );
}
