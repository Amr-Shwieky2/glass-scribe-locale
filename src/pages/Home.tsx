/**
 * Home Page
 * 
 * Main landing page with hero, services, projects, and testimonials.
 * All data is static - no backend required.
 */

import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, MessageCircle, ExternalLink } from 'lucide-react';
import HeroGallery from '@/components/HeroGallery';
import {
  CONTACT_INFO,
  SERVICES,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  getLocalizedArray,
  type SupportedLocale,
} from '@/data/business';

const Home: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  // WhatsApp handler
  const handleWhatsApp = useCallback(() => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent('Hello, I would like to inquire about your services');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  }, []);

  // Call handler
  const handleCall = useCallback(() => {
    window.location.href = `tel:${CONTACT_INFO.phoneIntl}`;
  }, []);

  const content = PAGE_CONTENT.home;

  return (
    <div className="min-h-screen">
      {/* Premium Animated Hero Gallery */}
      <HeroGallery />

      {/* Services Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {getLocalizedText(content.sections.services.title, locale)}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
              {getLocalizedText(content.sections.services.subtitle, locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {SERVICES.map((service) => (
              <Link 
                key={service.id}
                to={`/${currentLanguage}/projects?category=${service.id}`}
                className="service-card-animated block"
              >
                <div className="card-inner">
                  {/* Mac-style dots */}
                  <div className="service-card-dots">
                    <span className="service-card-dot red"></span>
                    <span className="service-card-dot yellow"></span>
                    <span className="service-card-dot green"></span>
                  </div>

                  {/* Service Image */}
                  <div className="card-image">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={getLocalizedText(service.title, locale)}
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-navy/50 flex items-center justify-center">
                        <span className="text-4xl">{service.icon}</span>
                      </div>
                    )}
                    <span className="card-icon">{service.icon}</span>
                  </div>
                  
                  {/* Card Content */}
                  <div className="card-content">
                    <h3 className="card-title">
                      {getLocalizedText(service.title, locale)}
                    </h3>
                    <p className="card-description">
                      {getLocalizedText(service.description, locale)}
                    </p>
                    <ul className="card-features">
                      {getLocalizedArray(service.features, locale).slice(0, 3).map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Hover arrow */}
                  <div className="card-arrow">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 lg:mt-12">
            <Link 
              to={`/${currentLanguage}/services`}
              className="btn-animated-navy inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              {getLocalizedText(UI_STRINGS.viewAll, locale)}
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {getLocalizedText(content.sections.testimonials.title, locale)}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
              {getLocalizedText(content.sections.testimonials.subtitle, locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              'DT5ewAzArhq',
              'DT-neXFgvGn',
              'DURWhbljZKb',
              'DUlRLW7jXvJ',
            ].map((reelId) => (
              <div key={reelId} className="flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow bg-white">
                <div className="relative w-full" style={{ paddingBottom: '125%' }}>
                  <iframe
                    src={`https://www.instagram.com/reel/${reelId}/embed/`}
                    className="absolute inset-0 w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    title={`Shwaki Glassworks Reel ${reelId}`}
                  />
                </div>
                <a
                  href={`https://www.instagram.com/reel/${reelId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-brand-navy hover:text-brand-gold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {locale === 'he' ? 'צפה באינסטגרם' : locale === 'ar' ? 'شاهد على إنستغرام' : locale === 'ru' ? 'Смотреть в Instagram' : 'View on Instagram'}
                </a>
              </div>
            ))}
          </div>

          {/* Follow on Instagram */}
          <div className="text-center mt-8 sm:mt-10">
            <a
              href="https://www.instagram.com/shwaki_glassworks/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-animated-navy inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              {locale === 'he' ? 'עקבו אחרינו באינסטגרם' : locale === 'ar' ? 'تابعونا على إنستغرام' : locale === 'ru' ? 'Подписывайтесь на нас в Instagram' : 'Follow Us on Instagram'}
              <ExternalLink className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {locale === 'he' ? 'מוכנים לשנות את המרחב שלכם?' :
             locale === 'ar' ? 'مستعد لتحويل مساحتك؟' :
             locale === 'ru' ? 'Готовы преобразить ваше пространство?' :
             'Ready to Transform Your Space?'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto text-white/80 px-2">
            {locale === 'he' ? 'צרו קשר היום לייעוץ והצעת מחיר ללא עלות' :
             locale === 'ar' ? 'اتصل بنا اليوم للحصول على استشارة وعرض أسعار مجاني' :
             locale === 'ru' ? 'Свяжитесь с нами сегодня для бесплатной консультации и расчёта стоимости' :
             'Contact us today for a free consultation and quote'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-lg sm:max-w-none mx-auto">
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
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>

          {/* Contact Details */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 text-brand-gold/80 text-sm sm:text-base">
            <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="hover:text-brand-gold transition-colors py-1">
              📱 {CONTACT_INFO.phone}
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
