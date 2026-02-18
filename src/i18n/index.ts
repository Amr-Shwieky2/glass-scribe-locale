/**
 * i18n Configuration
 * 
 * Translations are split into per-language files in ./locales/
 * Add a new language by creating a new locale file and adding it here.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en';
import he from './locales/he';
import ar from './locales/ar';
import ru from './locales/ru';

const resources = {
  en: { translation: en },
  he: { translation: he },
  ar: { translation: ar },
  ru: { translation: ru },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'he',
    supportedLngs: ['he', 'en', 'ar', 'ru'],
    detection: {
      order: ['path', 'localStorage', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
