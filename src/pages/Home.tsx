/**
 * Home Page - Orchestrator
 */

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, MessageCircle } from 'lucide-react';
import HeroGallery from '@/components/HeroGallery';
import HomeServices from '@/components/home/HomeServices';
import HomeTestimonials from '@/components/home/HomeTestimonials';
import { CONTACT_INFO, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

const Home: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  const handleWhatsApp = useCallback(() => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent('Hello, I would like to inquire about your services')}`, '_blank');
  }, []);

  return (
    <div className="min-h-screen">
      <HeroGallery />
      <HomeServices locale={locale} currentLanguage={currentLanguage} />
      <HomeTestimonials locale={locale} />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-brand-gold">{getLocalizedText(UI_STRINGS.ctaReadyToTransform, locale)}</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-white/80 px-2">{getLocalizedText(UI_STRINGS.ctaContactToday, locale)}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto">
            <button onClick={handleWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg">
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <Link to={`/${currentLanguage}/contact`} className="btn-animated-gold inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg">
              {getLocalizedText(UI_STRINGS.ctaContactUs, locale)}<ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 text-brand-gold/80 text-sm sm:text-base">
            <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-brand-gold transition-colors py-1">📱 {CONTACT_INFO.phone}</a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-brand-gold transition-colors py-1">✉️ {CONTACT_INFO.email}</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
