import type { Metadata } from 'next';
import Services from '@/views/Services';
import { assertLocale } from '@/lib/i18n';
import { getServiceCardImageIds } from '@/lib/cloudinary/server';
import { getThumbnailUrl } from '@/lib/cloudinary/urls';
import { buildPageMetadata, getPageSeo } from '@/data/seo';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocale((await params).lang);
  return buildPageMetadata(locale, '/services', getPageSeo('services', locale));
}

export default async function Page({ params }: Props) {
  const locale = assertLocale((await params).lang);
  const ids = await getServiceCardImageIds({ folderFallback: true });
  const serviceImageMap = Object.fromEntries(Object.entries(ids).map(([serviceId, publicId]) => [serviceId, getThumbnailUrl(publicId, 600)]));
  return <Services locale={locale} serviceImageMap={serviceImageMap} />;
}
