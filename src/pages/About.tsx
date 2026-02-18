/**
 * About Page - Static Content
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import {
  BUSINESS_INFO,
  CONTACT_INFO,
  WHY_CHOOSE_US,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

const About: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.about;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
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

      {/* Story Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Image/Visual */}
              <div className="relative">
                <div className="aspect-square bg-brand-navy rounded-2xl sm:rounded-3xl flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">🏗️</span>
                </div>
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-gold">{BUSINESS_INFO.established}</p>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {locale === 'he' ? 'מאז' : locale === 'ar' ? 'منذ' : locale === 'ru' ? 'С' : 'Since'}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="mt-8 md:mt-0">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-brand-navy">
                  {locale === 'he' ? 'הסיפור שלנו' :
                   locale === 'ar' ? 'قصتنا' :
                   locale === 'ru' ? 'Наша история' :
                   'Our Story'}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                  {getLocalizedText(content.story, locale)}
                </p>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { en: 'Licensed and insured business', he: 'עסק מורשה ומבוטח', ar: 'عمل مرخص ومؤمن', ru: 'Лицензированный и застрахованный бизнес' },
                    { en: 'Expert craftsmen with years of experience', he: 'אומנים מומחים עם שנות ניסיון', ar: 'حرفيون خبراء بسنوات من الخبرة', ru: 'Опытные мастера с многолетним стажем' },
                    { en: 'Premium quality materials only', he: 'חומרים איכותיים בלבד', ar: 'مواد عالية الجودة فقط', ru: 'Только материалы премиум-качества' },
                    { en: 'Customer satisfaction guarantee', he: 'ערבות לשביעות רצון הלקוח', ar: 'ضمان رضا العملاء', ru: 'Гарантия удовлетворённости клиентов' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
                      <span className="text-brand-navy/80 text-sm sm:text-base">{getLocalizedText(item, locale)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {content.stats.map((stat, index) => (
              <div key={index} className="p-4 sm:p-6 md:p-8">
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4">{stat.value}</p>
                <p className="text-base sm:text-lg md:text-xl opacity-90">{getLocalizedText(stat.label, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {getLocalizedText(PAGE_CONTENT.home.sections.whyUs.title, locale)}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {getLocalizedText(PAGE_CONTENT.home.sections.whyUs.subtitle, locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {WHY_CHOOSE_US.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-5 sm:p-6 md:p-8 text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">{item.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-brand-navy">
                    {getLocalizedText(item.title, locale)}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {getLocalizedText(item.description, locale)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto mb-6 sm:mb-8 bg-brand-light rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/expert-service.png" 
                alt="Expert Service"
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-brand-navy">{BUSINESS_INFO.owner}</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-2">
              {locale === 'he' ? 'בעלים ומנהל' :
               locale === 'ar' ? 'المالك والمدير' :
               locale === 'ru' ? 'Владелец и управляющий' :
               'Owner & Manager'}
            </p>
            <p className="text-gray-500 text-sm sm:text-base">
              {getLocalizedText(BUSINESS_INFO.name, locale)}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
              <button onClick={handleWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {getLocalizedText(UI_STRINGS.whatsapp, locale)}
              </button>
              <a 
                href={`tel:${CONTACT_INFO.phoneIntl}`}
                className="btn-animated-navy inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
              >
                <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {locale === 'he' ? 'מוכנים לעבוד איתנו?' :
             locale === 'ar' ? 'مستعد للعمل معنا؟' :
             locale === 'ru' ? 'Готовы работать с нами?' :
             'Ready to Work With Us?'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80">
            {locale === 'he' ? 'צרו קשר היום ונהפוך את החזון שלכם למציאות' :
             locale === 'ar' ? 'اتصل بنا اليوم ودعنا نحول رؤيتك إلى واقع' :
             locale === 'ru' ? 'Свяжитесь с нами сегодня, и мы воплотим ваше видение в реальность' :
             'Contact us today and let\'s turn your vision into reality'}
          </p>
          <Link 
            to={`/${currentLanguage}/contact`}
            className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
          >
            {locale === 'he' ? 'צרו קשר' :
             locale === 'ar' ? 'اتصل بنا' :
             locale === 'ru' ? 'Связаться с нами' :
             'Contact Us'}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
