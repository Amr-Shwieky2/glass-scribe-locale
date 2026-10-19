import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { assertLocale, LOCALES } from '@/lib/i18n';
import { SERVICE_SEO_PAGES, getServiceSeoPageByServiceId } from '@/data/service-seo-content';
import { getLocalizedText } from '@/data';
import { buildPageMetadata } from '@/data/seo';

/**
 * Legacy URL (/[lang]/services/[serviceId]). The same content lives at the
 * keyword slug (/[lang]/glass-shower-installation), so known ids 308-redirect
 * there instead of serving a duplicate page; unknown ids are a real 404.
 */

type Props = { params: Promise<{ lang: string; serviceId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SERVICE_SEO_PAGES.map((s) => ({ lang, serviceId: s.serviceId })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, serviceId } = await params;
  const locale = assertLocale(lang);
  const servicePage = getServiceSeoPageByServiceId(serviceId);
  if (!servicePage) notFound();

  // Canonical points at the keyword-slug page this URL redirects to
  return buildPageMetadata(locale, `/${servicePage.slug}`, {
    title: getLocalizedText(servicePage.metaTitle, locale),
    description: getLocalizedText(servicePage.metaDescription, locale),
    keywords: getLocalizedText(servicePage.keywords, locale),
  });
}

export default async function Page({ params }: Props) {
  const { lang, serviceId } = await params;
  const locale = assertLocale(lang);
  const servicePage = getServiceSeoPageByServiceId(serviceId);
  if (!servicePage) notFound();
  permanentRedirect(`/${locale}/${servicePage.slug}`);
}
