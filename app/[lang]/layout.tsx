import type { Metadata, Viewport } from 'next';
import { Providers } from '../providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Suspense } from 'react';
import MobileCTA from '@/components/MobileCTA';
import JsonLdSchema from '@/components/JsonLdSchema';
import '@/index.css'; // Global styles
import { DEFAULT_LANGUAGE } from '@/contexts/LanguageContext';

export async function generateStaticParams() {
  return ['he', 'en', 'ar', 'ru'].map((l) => ({ lang: l }));
}

export const viewport: Viewport = {
  themeColor: '#1a365d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Sometimes needed for better mobile experience with inputs
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || DEFAULT_LANGUAGE;
  
  // Basic metadata logic (similar to old SEOHead defaults)
  const isHeb = lang === 'he';
  const isAr = lang === 'ar';
  const isRu = lang === 'ru';
  
  const title = isHeb ? 'אחים שוואקי זכוכית | Shwaki Brothers Glassworks - מקלחונים, מעקות זכוכית, מראות' :
                isAr ? 'شويكي اخوان للزوجاج | زجاج الدش، درابزين، مرايا | زجّاج محترف' :
                isRu ? 'Братья Шваки — Стеклянные работы | Душевые кабины, Ограждения, Зеркала | Стекольщик Израиль' :
                'Shwaki Brothers Glassworks | Shower Glass, Railings, Mirrors | Glazier Israel';

  const description = isHeb ? 'אחים שוואקי זכוכית - מומחים להתקנת זכוכית מקצועית בישראל. מקלחונים, מעקות זכוכית, מראות, חזיתות חנויות. שירות מקצועי, מדידה חינם.' :
                      isAr ? 'زجّاج محترف وتركيب زجاج في إسرائيل - كبائن الدش، درابزين زجاجي، مرايا، واجهات. قياسات مجانية، خدمة في جميع أنحاء البلاد.' :
                      isRu ? 'Профессиональный стекольщик и установка стекла в Израиле - душевые кабины, стеклянные ограждения, зеркала, витрины. Бесплатные замеры по всей стране.' :
                      'Professional glazier and glass installation in Israel - shower enclosures, glass railings, mirrors, storefronts. Free measurements, nationwide service.';

  return {
    title: {
      template: '%s | Shwaki Brothers Glassworks',
      default: title,
    },
    description,
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
