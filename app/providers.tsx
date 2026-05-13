'use client';

import { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AdminProvider } from '@/contexts/AdminContext';
import AccessibilityWidget from '@/components/accessibility/AccessibilityWidget';
import CookieConsent from '@/components/CookieConsent';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <Analytics />
      <SpeedInsights />
      <Toaster />
      <AdminProvider>
        <LanguageProvider>
          <AccessibilityWidget />
          <CookieConsent />
          {children}
        </LanguageProvider>
      </AdminProvider>
    </TooltipProvider>
  );
}
