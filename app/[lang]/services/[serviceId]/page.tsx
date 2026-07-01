import { Metadata } from 'next';
import ServiceDetail from '@/views/ServiceDetail';
import { Suspense } from 'react';
import { getServiceSeoPageByServiceId } from '@/data/service-seo-content';
import { getLocalizedText, type SupportedLocale } from '@/data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; serviceId: string }>;
}): Promise<Metadata> {
  const { lang, serviceId } = await params;
  const locale = lang as SupportedLocale;
  const servicePage = getServiceSeoPageByServiceId(serviceId);

  if (!servicePage) return {};

  const title = getLocalizedText(servicePage.metaTitle, locale);
  const description = getLocalizedText(servicePage.metaDescription, locale);

  return {
    title,
    description,
    keywords: getLocalizedText(servicePage.keywords, locale),
    alternates: {
      canonical: `https://www.shwakiglassworks.com/${locale}/services/${serviceId}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceDetail />
    </Suspense>
  );
}