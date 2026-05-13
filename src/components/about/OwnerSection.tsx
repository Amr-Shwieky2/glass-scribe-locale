'use client';
import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import {
  BUSINESS_INFO, CONTACT_INFO, UI_STRINGS,
  getLocalizedText, type SupportedLocale,
} from '@/data';

interface OwnerSectionProps {
  locale: SupportedLocale;
}

const OwnerSection: React.FC<OwnerSectionProps> = ({ locale }) => {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  return (
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
            {getLocalizedText(UI_STRINGS.aboutOwnerTitle, locale)}
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
  );
};

export default OwnerSection;
