import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import {
  BUSINESS_INFO, CONTACT_INFO, FOOTER_CONTENT,
  getLocalizedText, type SupportedLocale,
} from '@/data';

interface FooterContactProps {
  locale: SupportedLocale;
}

const FooterContact: React.FC<FooterContactProps> = ({ locale }) => {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  return (
    <div>
      <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-brand-gold">
        {getLocalizedText(FOOTER_CONTENT.contact.title, locale)}
      </h4>
      <div className="space-y-3 sm:space-y-4">
        <a href={`tel:${CONTACT_INFO.phoneIntl}`} className="flex items-center gap-3 text-gray-400 hover:text-brand-gold transition-colors text-sm sm:text-base py-1">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
          {CONTACT_INFO.phone}
        </a>
        <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-gray-400 hover:text-brand-gold transition-colors text-sm sm:text-base py-1 break-all">
          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
          {CONTACT_INFO.email}
        </a>
        <div className="flex items-center gap-3 text-gray-400 text-sm sm:text-base py-1">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
          {getLocalizedText(BUSINESS_INFO.location, locale)}
        </div>
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 sm:gap-3 text-brand-navy hover:text-brand-navy transition-colors mt-4 bg-brand-gold px-4 py-2.5 sm:py-2 rounded-lg hover:bg-brand-gold/90 w-full sm:w-auto text-sm sm:text-base font-medium"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          WhatsApp
        </button>
      </div>
    </div>
  );
};

export default FooterContact;
