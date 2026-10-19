import type { Metadata } from 'next';
import '@/index.css';

export const metadata: Metadata = {
  title: '404 | אחים שוואקי זכוכית · Shwaki Brothers Glassworks',
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/he', label: 'לדף הבית', lang: 'he', dir: 'rtl' },
  { href: '/en', label: 'Home', lang: 'en', dir: 'ltr' },
  { href: '/ar', label: 'الصفحة الرئيسية', lang: 'ar', dir: 'rtl' },
  { href: '/ru', label: 'На главную', lang: 'ru', dir: 'ltr' },
] as const;

/**
 * 404 for URLs that match no route at all (e.g. /xx — the root layout lives
 * under the dynamic [lang] segment, so it can't render these).
 */
export default function GlobalNotFound() {
  return (
    <html lang="he" dir="rtl">
      <body className="font-sans antialiased text-brand-navy">
        <main className="flex min-h-screen items-center justify-center bg-brand-light">
          <div className="text-center px-4">
            <h1 className="mb-4 text-6xl sm:text-7xl font-bold text-brand-navy">404</h1>
            <p className="mb-2 text-xl sm:text-2xl font-semibold" lang="he">הדף לא נמצא</p>
            <p className="mb-6 text-lg text-brand-navy/70" lang="en" dir="ltr">Page not found</p>
            <nav className="flex flex-wrap justify-center gap-3">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  lang={l.lang}
                  dir={l.dir}
                  className="inline-flex items-center justify-center px-6 py-3 bg-brand-gold text-brand-navy font-medium rounded-full hover:bg-brand-gold/90 transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </main>
      </body>
    </html>
  );
}
