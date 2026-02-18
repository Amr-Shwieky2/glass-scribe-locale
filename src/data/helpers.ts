import type { SupportedLocale } from './types';

/**
 * Get localized text from a multi-language object
 */
export function getLocalizedText<T extends Record<SupportedLocale, string>>(
  textObj: T,
  locale: string
): string {
  const supportedLocale = (locale as SupportedLocale) || 'en';
  return textObj[supportedLocale] || textObj.en;
}

/**
 * Get localized array from a multi-language object
 */
export function getLocalizedArray<T extends Record<SupportedLocale, string[]>>(
  arrayObj: T,
  locale: string
): string[] {
  const supportedLocale = (locale as SupportedLocale) || 'en';
  return arrayObj[supportedLocale] || arrayObj.en;
}
