import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Providers } from '../providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Suspense } from 'react';
import MobileCTA from '@/components/MobileCTA';
import JsonLdSchema from '@/components/JsonLdSchema';
import '@/index.css'; // Global styles
import { DEFAULT_LANGUAGE } from '@/contexts/LanguageContext';

const GA_ID = 'G-ZMSX4TGLBJ';

export async function generateStaticParams() {
  return ['he', 'en', 'ar', 'ru'].map((l) => ({ lang: l }));
}

export const viewport: Viewport = {
  themeColor: '#1a365d',
  width: 'device-width',
  initialScale: 1,
  // Note: Do NOT set maximumScale here — it blocks pinch-zoom (WCAG violation)
  // and causes iPad Safari to fail to render the page correctly.
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || DEFAULT_LANGUAGE;
  
  // Basic metadata logic (similar to old SEOHead defaults)
  const isHeb = lang === 'he';
  const isAr = lang === 'ar';
  const isRu = lang === 'ru';
  
  const title = isHeb ? 'אחים שוואקי זכוכית | מקלחונים, מעקות זכוכית, מראות | זגג מקצועי ישראל' :
                isAr ? 'شويكي اخوان للزوجاج | كابينات دش، درابزين زجاجي، مرايا | زجّاج محترف في إسرائيل' :
                isRu ? 'Братья Шваки — Стеклянные работы | Душевые кабины, Ограждения, Зеркала | Стекольщик Израиль' :
                'Shwaki Brothers Glassworks | Shower Glass, Railings, Mirrors | #1 Glazier Israel';

  const description = isHeb ? 'אחים שוואקי זכוכית – מומחים להתקנת זכוכית בישראל מאז 2015. מקלחונים, מעקות זכוכית, מראות, חזיתות חנויות. ⭐ 4.9/5 מ-127 ביקורות. מדידה חינם, אחריות שנתיים, שירות בכל הארץ.' :
                      isAr ? 'زجّاج محترف وتركيب زجاج في إسرائيل منذ 2015 – كابينات الدش، درابزين زجاجي، مرايا، واجهات. ⭐ 4.9/5 من 127 تقييم. قياسات مجانية، ضمان سنتين، خدمة في جميع أنحاء البلاد.' :
                      isRu ? 'Профессиональный стекольщик в Израиле с 2015 г. — душевые кабины, стеклянные ограждения, зеркала, витрины. ⭐ 4.9/5 по 127 отзывам. Бесплатный замер, гарантия 2 года, работаем по всей стране.' :
                      'Professional glazier & glass installation in Israel since 2015 — shower enclosures, glass railings, mirrors, storefronts. ⭐ 4.9/5 from 127 reviews. Free measurement, 2-year warranty, nationwide service.';

  const keywords = isHeb
    ? 'זכוכית, מקלחון, מעקות זכוכית, מראות, זגג, התקנת זכוכית, זכוכית מחוסמת, מחיצות זכוכית, חזיתות חנויות, ירושלים, תל אביב, ישראל'
    : isAr
    ? 'زجاج, كابينة دش, درابزين زجاجي, مرايا, زجّاج, تركيب زجاج, زجاج مقسى, فواصل زجاجية, واجهات, إسرائيل'
    : isRu
    ? 'стекло, душевая кабина, стеклянные ограждения, зеркала, стекольщик, установка стекла, закалённое стекло, перегородки, витрины, Израиль'
    : 'glass, shower enclosure, glass railing, mirrors, glazier, glass installation, tempered glass, glass partitions, storefronts, Israel';

  return {
    title: {
      template: '%s | Shwaki Brothers Glassworks',
      default: title,
    },
    description,
    keywords,
    manifest: '/site.webmanifest',
    alternates: {
      canonical: `https://www.shwakiglassworks.com/${lang}`,
      languages: {
        'he': 'https://www.shwakiglassworks.com/he',
        'en': 'https://www.shwakiglassworks.com/en',
        'ar': 'https://www.shwakiglassworks.com/ar',
        'ru': 'https://www.shwakiglassworks.com/ru',
        'x-default': 'https://www.shwakiglassworks.com/he',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.shwakiglassworks.com/${lang}`,
      siteName: 'Shwaki Brothers Glassworks',
      images: [
        {
          url: 'https://res.cloudinary.com/dc1q8upxt/image/upload/c_fill,w_1200,h_630,g_auto,q_auto,f_jpg/shwaki-glassworks/hero/1',
          width: 1200,
          height: 630,
        },
      ],
      locale: isHeb ? 'he_IL' : isAr ? 'ar_SA' : isRu ? 'ru_RU' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://res.cloudinary.com/dc1q8upxt/image/upload/c_fill,w_1200,h_630,g_auto,q_auto,f_jpg/shwaki-glassworks/hero/1'],
    },
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
  const resolvedParams = await params;
  const lang = resolvedParams.lang || DEFAULT_LANGUAGE;
  const isRTL = ['he', 'ar'].includes(lang);

  return (
    <html lang={lang} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* We add suppressing hydration warnings just in case extensions modify body attributes */}
      <body suppressHydrationWarning className="font-sans antialiased text-brand-navy selection:bg-brand-gold/20 selection:text-brand-navy">
        {/* Google Analytics 4 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}</Script>
        <Providers>
          <JsonLdSchema lang={lang} />
          
          <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
             <a href="#main-content" className="skip-to-main" tabIndex={0}>
              {lang === 'he' ? 'דלג לתוכן הראשי' :
               lang === 'ar' ? 'انتقل إلى المحتوى الرئيسي' :
               lang === 'ru' ? 'Перейти к основному содержанию' :
               'Skip to main content'}
             </a>
             
             <Suspense fallback={<header className="h-16 bg-white" />}>
               <Header />
             </Suspense>
             <main id="main-content" className="flex-1" tabIndex={-1}>
               {children}
             </main>
             <Footer />
             <MobileCTA />
          </div>
        </Providers>
      </body>
    </html>
  );
}
