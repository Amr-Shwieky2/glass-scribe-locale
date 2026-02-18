/**
 * Services Page - Static Content
 * 
 * All service information is hardcoded for reliability.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import { useCloudinaryImages, getThumbnailUrl as getCldThumbnail } from '@/hooks/useCloudinaryImages';
import {
  SERVICES,
  CONTACT_INFO,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  getLocalizedArray,
  type SupportedLocale,
} from '@/data/business';

const Services: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.services;

  // Fetch all Cloudinary images — we'll pick one per service category
  const { images: allCloudImages } = useCloudinaryImages(undefined, { limit: 100 });

  // Build a map: service ID → first Cloudinary image URL
  const serviceImageMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    // Map service IDs to Cloudinary folder path fragments
    const serviceToFolder: Record<string, string> = {
      'shower-glass': 'shower-enclosures',
      'glass-railings': 'glass-railings',
      'mirrors': 'mirrors',
      'glass-partitions': 'partitions',
      'storefront-glass': 'storefronts',
      'custom-glass': 'backsplashes',
      'glass-doors': 'glass-doors',
      'backsplashes': 'backsplashes',
      'shelves': 'shelves',
      'lobbies': 'lobbies',
    };

    for (const service of SERVICES) {
      const folder = serviceToFolder[service.id];
      if (!folder) continue;
      const match = allCloudImages.find((img) =>
        img.public_id.includes(`/${folder}/`)
      );
      if (match) {
        map[service.id] = getCldThumbnail(match.public_id, 600);
      }
    }
    return map;
  }, [allCloudImages]);

  const handleWhatsApp = () => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent('Hello, I would like to inquire about your services');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(content.title, locale)}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-2">
            {getLocalizedText(content.subtitle, locale)}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              onClick={handleWhatsApp}
              className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.getQuote, locale)}
            </button>
            <a 
              href={`tel:${CONTACT_INFO.phoneIntl}`}
              className="btn-animated-gold inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.callNow, locale)}
            </a>
          </div>
        </div>
      </AnimatedPageHeader>

      {/* Services Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {SERVICES.map((service, index) => (
              <Card 
                key={service.id} 
                className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image Section - Cloudinary or icon fallback */}
                    <div className="md:w-1/3 bg-gradient-to-br from-brand-navy to-brand-navy/80 relative min-h-[160px] sm:min-h-[200px] overflow-hidden">
                      {serviceImageMap[service.id] ? (
                        <img
                          src={serviceImageMap[service.id]}
                          alt={getLocalizedText(service.title, locale)}
                          className="w-full h-full object-cover absolute inset-0"
                          loading="lazy"
                          onError={(e) => {
                            // Fallback to icon on error
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
                          <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">{service.icon}</span>
                        </div>
                      )}
                      {/* Gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                      {/* Service icon badge */}
                      <div className="absolute bottom-3 right-3 w-10 h-10 sm:w-12 sm:h-12 bg-brand-gold/90 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                        {service.icon}
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="md:w-2/3 p-5 sm:p-6 md:p-8">
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-brand-navy">
                        {getLocalizedText(service.title, locale)}
                      </h3>
                      <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                        {getLocalizedText(service.description, locale)}
                      </p>
                      
                      {/* Features List */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {getLocalizedArray(service.features, locale).map((feature, i) => (
                          <div key={i} className="flex items-center text-brand-navy/80 text-sm sm:text-base">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold mr-2 sm:mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleWhatsApp}
                        className="btn-animated-navy inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
                      >
                        {getLocalizedText(UI_STRINGS.getQuote, locale)}
                        <ArrowRight className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {locale === 'he' ? 'איך אנחנו עובדים' :
               locale === 'ar' ? 'كيف نعمل' :
               locale === 'ru' ? 'Как мы работаем' :
               'How We Work'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              {locale === 'he' ? 'תהליך פשוט ושקוף מההתחלה ועד הסוף' :
               locale === 'ar' ? 'عملية بسيطة وشفافة من البداية إلى النهاية' :
               locale === 'ru' ? 'Простой и прозрачный процесс от начала до конца' :
               'Simple and transparent process from start to finish'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: { en: 'Consultation', he: 'ייעוץ', ar: 'استشارة', ru: 'Консультация' }, image: '/phone-support.png' },
              { step: 2, title: { en: 'Measurement', he: 'מדידה', ar: 'قياس', ru: 'Замер' }, image: '/measurement.png' },
              { step: 3, title: { en: 'Quote', he: 'הצעת מחיר', ar: 'عرض أسعار', ru: 'Расчёт' }, image: '/admin-work.png' },
              { step: 4, title: { en: 'Installation', he: 'התקנה', ar: 'تركيب', ru: 'Монтаж' }, image: '/installation.png' },
            ].map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-brand-light rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 shadow-lg overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={`Step ${item.step}`}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                  />
                </div>
                <div className="font-medium text-brand-gold text-xs sm:text-sm mb-1">
                  {locale === 'he' ? `שלב ${item.step}` :
                   locale === 'ar' ? `الخطوة ${item.step}` :
                   locale === 'ru' ? `Шаг ${item.step}` :
                   `Step ${item.step}`}
                </div>
                <h3 className="font-bold text-brand-navy text-sm sm:text-base">
                  {getLocalizedText(item.title, locale)}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 lg:mt-12">
            <Link 
              to={`/${currentLanguage}/contact`}
              className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              {locale === 'he' ? 'קבלו הצעת מחיר חינם' :
               locale === 'ar' ? 'احصل على عرض أسعار مجاني' :
               locale === 'ru' ? 'Получите бесплатный расчёт' :
               'Get a Free Quote'}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {locale === 'he' ? 'מוכנים להתחיל?' :
             locale === 'ar' ? 'مستعد للبدء؟' :
             locale === 'ru' ? 'Готовы начать?' :
             'Ready to Get Started?'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-2">
            {locale === 'he' ? 'צרו קשר היום לייעוץ והצעת מחיר ללא עלות' :
             locale === 'ar' ? 'اتصل بنا اليوم للحصول على استشارة وعرض أسعار مجاني' :
             locale === 'ru' ? 'Свяжитесь с нами сегодня для бесплатной консультации и расчёта стоимости' :
             'Contact us today for a free consultation and quote'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button
              onClick={handleWhatsApp}
              className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <Link 
              to={`/${currentLanguage}/contact`}
              className="btn-animated-gold inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              {locale === 'he' ? 'צרו קשר' :
               locale === 'ar' ? 'اتصل بنا' :
               locale === 'ru' ? 'Связаться с нами' :
               'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
