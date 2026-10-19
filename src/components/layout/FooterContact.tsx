import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { BUSINESS_INFO } from '@/data/business-info';
import { CONTACT_INFO, SOCIAL_LINKS } from '@/data/contact';
import { FOOTER_CONTENT } from '@/data/footer';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

interface FooterContactProps {
  locale: SupportedLocale;
}

const FooterContact: React.FC<FooterContactProps> = ({ locale }) => {

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
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 sm:gap-3 text-brand-navy hover:text-brand-navy transition-colors mt-4 bg-brand-gold px-4 py-2.5 sm:py-2 rounded-lg hover:bg-brand-gold/90 w-full sm:w-auto text-sm sm:text-base font-medium"
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          WhatsApp
        </a>
        
        {/* Social Media Links */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-brand-gold transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-brand-gold transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
          </a>
          <a
            href={SOCIAL_LINKS.google}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-brand-gold transition-colors"
            aria-label="Google Business"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterContact;
