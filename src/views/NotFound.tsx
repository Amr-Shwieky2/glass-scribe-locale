'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

const NotFound = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-light">
      <div className="text-center px-4">
        <h1 className="mb-4 text-6xl sm:text-7xl font-bold text-brand-navy">404</h1>
        <p className="mb-3 text-xl sm:text-2xl font-semibold text-brand-navy">{getLocalizedText(UI_STRINGS.pageNotFound, locale)}</p>
        <p className="mb-6 text-brand-navy/70 text-sm sm:text-base">{getLocalizedText(UI_STRINGS.pageNotFoundMessage, locale)}</p>
        <a href={`/${currentLanguage}`} className="inline-flex items-center justify-center px-6 py-3 bg-brand-gold text-brand-navy font-medium rounded-full hover:bg-brand-gold/90 transition-colors">
          {getLocalizedText(UI_STRINGS.backToHome, locale)}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
