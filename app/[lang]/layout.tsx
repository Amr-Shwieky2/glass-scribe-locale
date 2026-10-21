import type { Metadata, Viewport } from 'next';
import { Heebo } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Providers } from '../providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileCTA from '@/components/MobileCTA';
import ChatLauncher from '@/components/chat/ChatLauncher';
import { getChatLauncherStrings } from '@/data/chat';
import JsonLdSchema from '@/components/JsonLdSchema';
import '@/index.css'; // Global styles
import { isLocale, isRTLLocale, localeParams } from '@/lib/i18n';
import { getAggregateRating } from '@/lib/google-places';
import { GA_ID } from '@/lib/gtag';
import { DEFAULT_SEO, SITE_URL } from '@/data/seo';

// Self-hosted by next/font (no render-blocking Google Fonts stylesheet).
// Heebo covers Hebrew + Latin; Arabic/Cyrillic fall back to system fonts.
const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  display: 'swap',
  variable: '--font-heebo',
});

export const dynamicParams = false;

export function generateStaticParams() {
  return localeParams();
}

export const viewport: Viewport = {
  themeColor: '#1a365d',
  width: 'device-width',
  initialScale: 1,
  // Note: Do NOT set maximumScale here — it blocks pinch-zoom (WCAG violation)
  // and causes iPad Safari to fail to render the page correctly.
};

/**
 * Site-wide metadata only. Title, description, canonical and hreflang are set
 * per page via buildPageMetadata() — the layout must NOT set a canonical,
 * otherwise every page inherits the homepage URL.
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : 'he';

  return {
    metadataBase: new URL(SITE_URL),
    title: DEFAULT_SEO[locale].title,
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    other: {
      'geo.region': 'IL-JM',
      'geo.placename': 'Jerusalem, Israel',
      'geo.position': '31.7683;35.2137',
      'ICBM': '31.7683, 35.2137',
      'rating': 'general',
      'revisit-after': '7 days',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const isRTL = isRTLLocale(lang);
  const rating = await getAggregateRating();

  return (
    <html lang={lang} dir={isRTL ? "rtl" : "ltr"} className={heebo.variable} suppressHydrationWarning>
      {/* We add suppressing hydration warnings just in case extensions modify body attributes */}
      <body suppressHydrationWarning className="font-sans antialiased text-brand-navy selection:bg-brand-gold/20 selection:text-brand-navy">
        {/* 1) Flags JS support before first paint (scroll-reveal never hides content for no-JS visitors/crawlers).
            2) GA4: commands queue in dataLayer immediately (nothing is lost); the 180 KB gtag.js itself loads
               on the first interaction or 3.5s after page load, so it never competes with the LCP image. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');(function(){var done=false;function load(){if(done)return;done=true;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);}['pointerdown','keydown','touchstart','scroll'].forEach(function(e){addEventListener(e,load,{once:true,passive:true});});addEventListener('load',function(){setTimeout(load,3500);});})();`,
          }}
        />
        <JsonLdSchema lang={lang} rating={rating} />
        <Providers lang={lang}>
          <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
             <a href="#main-content" className="skip-to-main" tabIndex={0}>
              {lang === 'he' ? 'דלג לתוכן הראשי' :
               lang === 'ar' ? 'انتقل إلى المحتوى الرئيسي' :
               lang === 'ru' ? 'Перейти к основному содержанию' :
               'Skip to main content'}
             </a>

             <Header />
             <main id="main-content" className="flex-1" tabIndex={-1}>
               {children}
             </main>
             <Footer locale={lang} />
             <MobileCTA />
             <ChatLauncher lang={lang} strings={getChatLauncherStrings(lang)} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
