'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminProvider } from '@/contexts/AdminContext';

import RevealObserver from '@/components/animated/RevealObserver';
import type { SupportedLocale } from '@/data/types';

// Fixed-position overlays: loaded after hydration so their JS doesn't compete
// with the hero image on first load (no layout shift — they don't take space).
const AccessibilityWidget = dynamic(() => import('@/components/accessibility/AccessibilityWidget'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/CookieConsent'), { ssr: false });

export function Providers({ children, lang }: { children: ReactNode; lang: SupportedLocale }) {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <AdminProvider>
        <LanguageProvider lang={lang}>
          <AccessibilityWidget />
          <CookieConsent />
          <RevealObserver />
          {children}
        </LanguageProvider>
      </AdminProvider>
    </>
  );
}
