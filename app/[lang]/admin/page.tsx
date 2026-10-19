import type { Metadata } from 'next';
import AdminLogin from '@/views/Admin';
import { assertLocale } from '@/lib/i18n';
import { buildPageMetadata, getPageSeo } from '@/data/seo';

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = assertLocale((await params).lang);
  return buildPageMetadata(locale, '/admin', getPageSeo('admin', locale), { noindex: true });
}

export default function Page() {
  return <AdminLogin />;
}
