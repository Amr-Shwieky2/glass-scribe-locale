'use client';
/**
 * Home Page - Orchestrator
 * Optimized for SEO, AI Search (GEO), and Conversions
 */

import React, { useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import HomeServices from '@/components/home/HomeServices';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import ProcessSection from '@/components/home/ProcessSection';
import FAQSection from '@/components/home/FAQSection';
import HomeTestimonials from '@/components/home/HomeTestimonials';
import { CONTACT_INFO, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';
import { trackEvent } from '@/lib/gtag';

// CTA Section Content
const CTA_CONTENT = {
  title: {
    en: 'Ready to Transform Your Space?',
    he: 'מוכנים לשנות את המרחב שלכם?',
    ar: 'مستعد لتحويل مساحتك؟',
    ru: 'Готовы преобразить ваше пространство?',
  },
  subtitle: {
    en: 'Get a free quote today — no obligation, response within 2 hours',
    he: 'קבלו הצעת מחיר חינם היום — ללא התחייבות, מענה תוך שעתיים',
    ar: 'احصل على عرض أسعار مجاني اليوم — بدون التزام، رد خلال ساعتين',
    ru: 'Получите бесплатную оценку сегодня — без обязательств, ответ в течение 2 часов',
  },
  callNow: {
    en: 'Call Now',
    he: 'התקשרו עכשיו',
    ar: 'اتصل الآن',
    ru: 'Позвонить',
  },
};

const Home: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  const handleWhatsApp = useCallback(() => {
    trackEvent({ action: 'click_whatsapp', category: 'Contact', label: 'Home Page CTA' });
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(getLocalizedText(UI_STRINGS.whatsappServiceInquiry, locale))}`, '_blank');
  }, [locale]);

  const handleCall = useCallback(() => {
    trackEvent({ action: 'click_call', category: 'Contact', label: 'Home Page CTA' });
    window.location.href = `tel:${CONTACT_INFO.phoneIntl}`;
  }, []);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section - Single Image with Animation */}
      <HeroSection />
      
      {/* Services Section */}
      <HomeServices locale={locale} currentLanguage={currentLanguage} />
      
      {/* Social Proof - Instagram Reels */}
      <HomeTestimonials locale={locale} />

      {/* Why Choose Us - Value Proposition */}
      <WhyChooseUs locale={locale} currentLanguage={currentLanguage} />
      
      {/* Our Process - AI-friendly structured content */}
      <ProcessSection locale={locale} />

      {/* FAQ Section - For SEO and AI Search */}
      <FAQSection locale={locale} />

      {/* Final CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/95 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-gold rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(CTA_CONTENT.title, locale)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto text-white/80 px-2">
            {getLocalizedText(CTA_CONTENT.subtitle, locale)}
          </p>
          
          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto mb-6">
            <button 
              onClick={handleWhatsApp} 
              className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <button 
              onClick={handleCall}
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg bg-white/20 backdrop-blur-sm text-white font-bold rounded-full border-2 border-white/40 hover:bg-white/30 transition-all duration-300"
            >
              <Phone className="mr-2 w-5 h-5" />
              {getLocalizedText(CTA_CONTENT.callNow, locale)}
            </button>
            <Link 
              href={`/${currentLanguage}/contact`} 
              className="btn-animated-gold inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              {getLocalizedText(UI_STRINGS.ctaContactUs, locale)}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 text-brand-gold/80 text-sm sm:text-base">
            <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-brand-gold transition-colors py-1 flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              {CONTACT_INFO.phone}
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-gold transition-colors py-1">
              ✉️ {CONTACT_INFO.email}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
