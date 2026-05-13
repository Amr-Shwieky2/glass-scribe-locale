'use client';
/**
 * Contact Page - Orchestrator
 */

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import ContactInfoCards from '@/components/contact/ContactInfoCards';
import ContactForm from '@/components/contact/ContactForm';
import { PAGE_CONTENT, getLocalizedText, type SupportedLocale } from '@/data';

const Contact: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.contact;

  return (
    <div className="min-h-screen">
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
            <img src="/help-desk.png" alt="Contact Support" className="w-18 h-18 sm:w-24 sm:h-24 object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(content.title, locale)}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-2">
            {getLocalizedText(content.subtitle, locale)}
          </p>
        </div>
      </AnimatedPageHeader>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
            <ContactInfoCards locale={locale} />
            <div><ContactForm locale={locale} /></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
