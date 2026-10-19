'use client';
/**
 * @fileoverview Language Context Provider
 * @description Exposes the active locale to client components.
 *
 * The locale comes from the server (`params.lang` in app/[lang]/layout.tsx), so
 * server HTML and the hydrated client always agree — no URL parsing, no effects.
 * Switching language is a plain navigation to the same path under another locale;
 * the layout re-renders with the new `lang` prop.
 *
 * @example
 * ```tsx
 * const { currentLanguage, switchLanguage, isRTL } = useLanguage();
 * ```
 */

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DEFAULT_LOCALE, isLocale, isRTLLocale } from '@/lib/i18n';
import type { SupportedLocale } from '@/data/types';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Supported language configuration.
 */
export interface SupportedLanguage {
  /** ISO language code */
  code: string;
  /** English name of the language */
  name: string;
  /** Native name displayed in language selector */
  nativeName: string;
}

/**
 * Language context value provided to consumers.
 */
interface LanguageContextValue {
  /** Current active language code */
  currentLanguage: SupportedLocale;
  /** Function to switch to a different language */
  switchLanguage: (lang: string) => void;
  /** Whether current language is RTL (Hebrew, Arabic) */
  isRTL: boolean;
  /** List of all supported languages */
  supportedLanguages: SupportedLanguage[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const DEFAULT_LANGUAGE = DEFAULT_LOCALE;

/**
 * List of supported languages with display names.
 */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'en', name: 'English', nativeName: 'EN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'RU' },
];

// =============================================================================
// CONTEXT
// =============================================================================

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Hook to access language context.
 *
 * @returns Language context value
 * @throws Error if used outside LanguageProvider
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error(
      'useLanguage must be used within a LanguageProvider. ' +
      'Wrap your component tree with <LanguageProvider> to fix this error.'
    );
  }

  return context;
};

// =============================================================================
// PROVIDER
// =============================================================================

interface LanguageProviderProps {
  /** Locale from the `[lang]` route param, resolved on the server. */
  lang: SupportedLocale;
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ lang, children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = isRTLLocale(lang);

  /**
   * Navigates to the current path under another locale.
   */
  const switchLanguage = useCallback((next: string) => {
    if (!isLocale(next)) {
      console.warn(`[LanguageContext] Unsupported language: ${next}`);
      return;
    }
    if (next === lang) return;

    const segments = (pathname || '/').split('/').filter(Boolean);
    if (isLocale(segments[0])) segments[0] = next;
    else segments.unshift(next);

    const query = typeof window !== 'undefined' ? window.location.search : '';
    router.push('/' + segments.join('/') + query);
  }, [lang, pathname, router]);

  const contextValue = useMemo<LanguageContextValue>(
    () => ({
      currentLanguage: lang,
      switchLanguage,
      isRTL,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [lang, switchLanguage, isRTL]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
