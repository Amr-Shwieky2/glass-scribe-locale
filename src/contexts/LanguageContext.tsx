'use client';
/**
 * @fileoverview Language Context Provider
 * @description Context provider for internationalization and language switching.
 * Handles RTL/LTR direction, URL-based locale, and i18n integration.
 *
 * @example
 * ```tsx
 * // In App.tsx
 * <LanguageProvider>
 *   <App />
 * </LanguageProvider>
 *
 * // In components
 * const { currentLanguage, switchLanguage, isRTL } = useLanguage();
 * ```
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';

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
  currentLanguage: string;
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

export const DEFAULT_LANGUAGE = 'he';

/**
 * List of supported languages with display names.
 */
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  { code: 'en', name: 'English', nativeName: 'EN' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ru', name: 'Russian', nativeName: 'RU' },
] as const;

/**
 * RTL language codes.
 */
const RTL_LANGUAGES = new Set(['he', 'ar']);

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

/**
 * Props for LanguageProvider component.
 */
interface LanguageProviderProps {
  children: React.ReactNode;
}

/**
 * Language provider component.
 * Manages language state, URL synchronization, and document direction.
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Detect initial language from URL path.
   */
  const getLanguageFromUrl = useCallback((): string => {
    if (!pathname) return 'he';
    const pathSegments = pathname.split('/').filter(Boolean);
    const urlLang = pathSegments[0];
    const isValidLang = SUPPORTED_LANGUAGES.some((l) => l.code === urlLang);
    return isValidLang ? urlLang : 'he';
  }, [pathname]);

  // Current language state - initialized from URL
  const [currentLanguage, setCurrentLanguage] = useState(() => getLanguageFromUrl());

  // Compute RTL status
  const isRTL = RTL_LANGUAGES.has(currentLanguage);

  /**
   * Sync language from URL changes (browser back/forward navigation).
   */
  useEffect(() => {
    const urlLang = getLanguageFromUrl();
    if (urlLang !== currentLanguage) {
      setCurrentLanguage(urlLang);
      if (i18n.language !== urlLang) {
        i18n.changeLanguage(urlLang);
      }
    }
  }, [pathname, currentLanguage, getLanguageFromUrl, i18n]);

  /**
   * Update document direction and language attributes.
   */
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  /**
   * Switches the active language and updates the URL.
   */
  const switchLanguage = useCallback((lang: string) => {
    // Validate language is supported
    const isSupported = SUPPORTED_LANGUAGES.some((l) => l.code === lang);
    if (!isSupported) {
      console.warn(`[LanguageContext] Unsupported language: ${lang}`);
      return;
    }

    // Update i18n
    i18n.changeLanguage(lang);
    setCurrentLanguage(lang);

    // Update URL to include language
    if (!pathname) return;
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentPathHasLang = SUPPORTED_LANGUAGES.some((l) => l.code === pathSegments[0]);

    let newPath: string;
    if (currentPathHasLang) {
      // Replace existing language segment
      pathSegments[0] = lang;
      newPath = '/' + pathSegments.join('/');
    } else {
      // Prepend language to path
      newPath = '/' + lang + pathname;
    }

    router.push(newPath);
  }, [i18n, pathname, router]);

  /**
   * Memoized context value.
   */
  const contextValue = useMemo<LanguageContextValue>(
    () => ({
      currentLanguage,
      switchLanguage,
      isRTL,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [currentLanguage, switchLanguage, isRTL]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};