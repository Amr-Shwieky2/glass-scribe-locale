/**
 * Locale configuration — server-safe (no 'use client'), shared by routes,
 * metadata helpers and client components.
 */
import { notFound } from 'next/navigation';
import type { SupportedLocale } from '@/data/types';

export const LOCALES = ['he', 'en', 'ar', 'ru'] as const satisfies readonly SupportedLocale[];
export const DEFAULT_LOCALE: SupportedLocale = 'he';

const RTL_LOCALES = new Set<SupportedLocale>(['he', 'ar']);

export function isLocale(value: string | undefined | null): value is SupportedLocale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function isRTLLocale(locale: SupportedLocale): boolean {
  return RTL_LOCALES.has(locale);
}

/** `generateStaticParams` result for the `[lang]` segment. */
export function localeParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/** Validates the `[lang]` route param (callers pass `await params`). */
export function assertLocale(lang: string): SupportedLocale {
  if (!isLocale(lang)) notFound();
  return lang;
}
