/**
 * Services Page - Orchestrator
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, MessageCircle } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import ServiceCard from '@/components/services/ServiceCard';
import ProcessSteps from '@/components/services/ProcessSteps';
import { useCloudinaryImages, getThumbnailUrl as getCldThumbnail } from '@/hooks/cloudinary';
import { SERVICES, CONTACT_INFO, PAGE_CONTENT, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';
import { getServicePageHref } from '@/data/service-seo-content';

const Services: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.services;
  const { images: allCloudImages } = useCloudinaryImages(undefined, { limit: 100 });

  const serviceImageMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    const serviceToFolder: Record<string, string> = {
      'shower-glass': 'shower-enclosures', 'glass-railings': 'glass-railings', 'mirrors': 'mirrors',
      'glass-partitions': 'partitions', 'storefront-glass': 'storefronts',
      'glass-doors': 'glass-doors', 'backsplashes': 'backsplashes', 'shelves': 'shelves',
    };
    for (const service of SERVICES) {
      const folder = serviceToFolder[service.id];
      if (!folder) continue;
      const match = allCloudImages.find((img) => img.public_id.includes(`/${folder}/`));
      if (match) map[service.id] = getCldThumbnail(match.public_id, 600);
    }
    return map;
  }, [allCloudImages]);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(getLocalizedText(UI_STRINGS.whatsappServiceInquiry, locale))}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">{getLocalizedText(content.title, locale)}</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-2">{getLocalizedText(content.subtitle, locale)}</p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button onClick={handleWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.getQuote, locale)}
            </button>
            <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="btn-animated-gold inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
              <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.callNow, locale)}
            </a>
          </div>
        </div>
      </AnimatedPageHeader>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SERVICES.map((service) => {
              const detailHref = getServicePageHref(locale, service.id);
              const targetHref = detailHref || `/${currentLanguage}/projects?category=${service.id}`;
              return (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  locale={locale} 
                  imageUrl={serviceImageMap[service.id]} 
                  targetHref={targetHref} 
                />
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSteps locale={locale} currentLanguage={currentLanguage} />

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{getLocalizedText(UI_STRINGS.ctaReadyToStart, locale)}</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-2">{getLocalizedText(UI_STRINGS.ctaContactToday, locale)}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <button onClick={handleWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg">
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <Link to={`/${currentLanguage}/contact`} className="btn-animated-gold inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg">
              {getLocalizedText(UI_STRINGS.ctaContactUs, locale)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
