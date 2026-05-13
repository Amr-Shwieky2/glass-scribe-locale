'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MessageCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';;
import { CONTACT_INFO, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';
import { ctaVariants } from './heroConfig';

// Value proposition content
const VALUE_PROPS = {
  tagline: {
    en: 'Israel\'s Premier Glass Installation Experts',
    he: 'המומחים המובילים בישראל להתקנת זכוכית',
    ar: 'خبراء تركيب الزجاج الرائدون في إسرائيل',
    ru: 'Ведущие эксперты Израиля по установке стекла',
  },
  trustPoints: [
    {
      en: '15+ Years Experience',
      he: '15+ שנות ניסיון',
      ar: '+15 سنة خبرة',
      ru: '15+ лет опыта',
    },
    {
      en: '500+ Projects Completed',
      he: '500+ פרויקטים שהושלמו',
      ar: '+500 مشروع مكتمل',
      ru: '500+ завершённых проектов',
    },
    {
      en: 'Free On-Site Measurement',
      he: 'מדידה חינם באתר',
      ar: 'قياس مجاني في الموقع',
      ru: 'Бесплатный замер на месте',
    },
  ],
  responseTime: {
    en: 'Response within 2 hours',
    he: 'מענה תוך שעתיים',
    ar: 'رد خلال ساعتين',
    ru: 'Ответ в течение 2 часов',
  },
};

interface HeroCTAProps {
  locale: SupportedLocale;
  currentLanguage: string;
  ctaVisible: boolean;
}

const HeroCTA: React.FC<HeroCTAProps> = ({ locale, currentLanguage, ctaVisible }) => {
  const handleWhatsApp = () => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent(getLocalizedText(UI_STRINGS.whatsappServiceInquiry, locale));
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
      {/* Value Proposition Tagline */}
      <div className="mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-gold mb-4">
          {getLocalizedText(VALUE_PROPS.tagline, locale)}
        </h2>
        
        {/* Trust Points */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-4">
          {VALUE_PROPS.trustPoints.map((point, index) => (
            <div 
              key={index}
              className="flex items-center gap-1.5 text-white/80 text-sm sm:text-base"
            >
              <CheckCircle2 className="w-4 h-4 text-brand-gold" />
              <span>{getLocalizedText(point, locale)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
        <button
          onClick={handleWhatsApp}
          className="hero-cta-primary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-brand-gold text-brand-navy font-medium rounded-full hover:bg-brand-gold/90 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-brand-gold/20"
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
          href={`/${currentLanguage}/projects`}
          className="hero-cta-tertiary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-brand-gold font-medium hover:text-white transition-colors duration-300"
        >
          {getLocalizedText(UI_STRINGS.heroViewWork, locale)}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Response Time & Contact Info */}
      <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-white/50 text-sm">
        <span className="text-brand-gold/80 font-medium">
          ⚡ {getLocalizedText(VALUE_PROPS.responseTime, locale)}
        </span>
        <span className="hidden sm:inline">•</span>
        <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-white transition-colors">
          {CONTACT_INFO.phone}
        </a>
        <span className="hidden sm:inline">•</span>
        <span>{getLocalizedText(UI_STRINGS.heroServingAll, locale)}</span>
      </div>
    </motion.div>
  );
};

export default HeroCTA;
