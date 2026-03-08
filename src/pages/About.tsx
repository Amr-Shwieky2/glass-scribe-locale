/**
 * About Page - Clean & Short Design
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, CheckCircle, Phone, MessageCircle } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import { 
  BUSINESS_INFO, CONTACT_INFO, PAGE_CONTENT, UI_STRINGS, 
  getLocalizedText, type SupportedLocale 
} from '@/data';

const highlights = [
  { en: 'Licensed & Insured', he: 'מורשה ומבוטח', ar: 'مرخص ومؤمن', ru: 'Лицензия и страховка' },
  { en: 'Premium Materials', he: 'חומרים פרימיום', ar: 'مواد متميزة', ru: 'Премиум материалы' },
  { en: 'Free Consultation', he: 'ייעוץ חינם', ar: 'استشارة مجانية', ru: 'Бесплатная консультация' },
  { en: 'Nationwide Service', he: 'שירות בכל הארץ', ar: 'خدمة في جميع أنحاء البلاد', ru: 'По всей стране' },
];

const About: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.about;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(content.title, locale)}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">
            {getLocalizedText(content.subtitle, locale)}
          </p>
        </div>
      </AnimatedPageHeader>

      {/* Main Content - Story + Stats Combined */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Story with Visual */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center mb-12 md:mb-16">
              {/* Left: Year Badge */}
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-brand-navy to-brand-navy/80 rounded-full flex flex-col items-center justify-center shadow-xl">
                    <span className="text-5xl sm:text-6xl font-bold text-brand-gold">{BUSINESS_INFO.established}</span>
                    <span className="text-white/80 text-sm sm:text-base mt-1">
                      {getLocalizedText(UI_STRINGS.aboutSince, locale)}
                    </span>
                  </div>
                  {/* Decorative ring */}
                  <div className="absolute inset-0 w-40 h-40 sm:w-48 sm:h-48 border-2 border-brand-gold/30 rounded-full -m-2 animate-pulse" />
                </div>
              </div>

              {/* Right: Story Text */}
              <div className="md:col-span-3">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-brand-navy">
                  {getLocalizedText(UI_STRINGS.aboutOurStory, locale)}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                  {getLocalizedText(content.story, locale)}
                </p>
                {/* Highlights Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
                      <span className="text-brand-navy/80 text-sm sm:text-base font-medium">
                        {getLocalizedText(item, locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 bg-brand-light rounded-2xl p-6 sm:p-8 mb-12 md:mb-16">
              {content.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-1 sm:mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    {getLocalizedText(stat.label, locale)}
                  </p>
                </div>
              ))}
            </div>

            {/* Owner / Contact Section */}
            <div className="text-center bg-gradient-to-br from-brand-navy to-brand-navy/90 rounded-2xl p-8 sm:p-10 text-white">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">👨‍💼</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">{BUSINESS_INFO.owner}</h3>
              <p className="text-white/70 text-sm sm:text-base mb-6">
                {getLocalizedText(UI_STRINGS.aboutOwnerTitle, locale)} • {getLocalizedText(BUSINESS_INFO.name, locale)}
              </p>
              
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
                <button 
                  onClick={handleWhatsApp} 
                  className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 text-base"
                >
                  <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {getLocalizedText(UI_STRINGS.whatsapp, locale)}
                </button>
                <a
                  href={`tel:${CONTACT_INFO.phoneIntl}`}
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 text-base bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-brand-gold">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-brand-navy">
            {getLocalizedText(UI_STRINGS.ctaReadyToWork, locale)}
          </h2>
          <Link 
            to={`/${currentLanguage}/contact`} 
            className="inline-flex items-center justify-center px-8 py-3 bg-brand-navy text-white rounded-lg hover:bg-brand-navy/90 transition-colors text-base sm:text-lg font-medium"
          >
            {getLocalizedText(UI_STRINGS.ctaContactUs, locale)}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
