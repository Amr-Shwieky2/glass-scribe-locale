import type { Metadata } from 'next';
import PrivacyPolicy from '@/views/PrivacyPolicy';
import { assertLocale } from '@/lib/i18n';
import { buildPageMetadata, getPageSeo } from '@/data/seo';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocale((await params).lang);
  return buildPageMetadata(locale, '/privacy', getPageSeo('privacy', locale));
}

export default async function Page({ params }: Props) {
  const locale = assertLocale((await params).lang);
  return <PrivacyPolicy locale={locale} />;
}
