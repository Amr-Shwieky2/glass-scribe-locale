import type { Metadata } from 'next';
import TermsOfUse from '@/views/TermsOfUse';
import { assertLocale } from '@/lib/i18n';
import { buildPageMetadata, getPageSeo } from '@/data/seo';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocale((await params).lang);
  return buildPageMetadata(locale, '/terms', getPageSeo('terms', locale));
}

export default async function Page({ params }: Props) {
  const locale = assertLocale((await params).lang);
  return <TermsOfUse locale={locale} />;
}
