import type { Metadata } from 'next';
import NotFound from '@/views/NotFound';

export const metadata: Metadata = {
  title: { absolute: '404 | Shwaki Brothers Glassworks' },
  robots: { index: false, follow: true },
};

/** Rendered (with HTTP 404) for unknown slugs under /[lang]/… — localized via the layout's LanguageProvider. */
export default function LocalizedNotFound() {
  return <NotFound />;
}
