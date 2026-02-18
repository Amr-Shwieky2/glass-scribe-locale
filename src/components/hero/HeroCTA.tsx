import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CONTACT_INFO, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';
import { ctaVariants } from './heroConfig';

interface HeroCTAProps {
  locale: SupportedLocale;
  currentLanguage: string;
  ctaVisible: boolean;
}

const HeroCTA: React.FC<HeroCTAProps> = ({ locale, currentLanguage, ctaVisible }) => {
  const handleWhatsApp = () => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent('Hello, I would like to inquire about your services');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phoneIntl}`;
  };

  return (
    <motion.div
      className="mt-auto pt-8 lg:pt-12"
      variants={ctaVariants}
      initial="hidden"
      animate={ctaVisible ? 'visible' : 'hidden'}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
        <button
          onClick={handleWhatsApp}
          className="hero-cta-primary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-gold text-brand-navy font-medium rounded-full hover:bg-brand-gold/90 transition-all duration-300 hover:scale-[1.02]"
        >
          <MessageCircle className="w-5 h-5" />
          {getLocalizedText(UI_STRINGS.whatsapp, locale)}
        </button>
        <button
          onClick={handleCall}
          className="hero-cta-secondary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
        >
          <Phone className="w-5 h-5" />
          {getLocalizedText(UI_STRINGS.callNow, locale)}
        </button>
        <Link
          to={`/${currentLanguage}/projects`}
          className="hero-cta-tertiary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-brand-gold font-medium hover:text-white transition-colors duration-300"
        >
          {getLocalizedText(UI_STRINGS.heroViewWork, locale)}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Contact Info */}
      <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-white/50 text-sm">
        <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-white transition-colors">
          {CONTACT_INFO.phone}
        </a>
        <span className="hidden sm:inline">•</span>
        <span>{getLocalizedText(UI_STRINGS.heroLocation, locale)}</span>
        <span className="hidden sm:inline">•</span>
        <span>{getLocalizedText(UI_STRINGS.heroServingAll, locale)}</span>
      </div>
    </motion.div>
  );
};

export default HeroCTA;
