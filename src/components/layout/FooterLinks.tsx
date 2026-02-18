import React from 'react';
import { Link } from 'react-router-dom';
import {
  SERVICES, NAVIGATION, FOOTER_CONTENT,
  getLocalizedText, type SupportedLocale,
} from '@/data';

interface FooterLinksProps {
  locale: SupportedLocale;
  currentLanguage: string;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ locale, currentLanguage }) => (
  <>
    {/* Quick Links */}
    <div>
      <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-brand-gold">
        {getLocalizedText(FOOTER_CONTENT.quickLinks.title, locale)}
      </h4>
      <nav className="flex flex-col gap-2 sm:gap-3">
        {NAVIGATION.items.map((item) => (
          <Link
            key={item.href}
            to={item.href === '/' ? `/${currentLanguage}` : `/${currentLanguage}${item.href}`}
            className="text-gray-400 hover:text-brand-gold transition-colors text-sm sm:text-base py-1"
          >
            {getLocalizedText(item.label, locale)}
          </Link>
        ))}
      </nav>
    </div>

    {/* Services */}
    <div>
      <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-brand-gold">
        {getLocalizedText(FOOTER_CONTENT.services.title, locale)}
      </h4>
      <nav className="flex flex-col gap-2 sm:gap-3">
        {SERVICES.slice(0, 5).map((service) => (
          <Link
            key={service.id}
            to={`/${currentLanguage}/services`}
            className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2 text-sm sm:text-base py-1"
          >
            <span>{service.icon}</span>
            {getLocalizedText(service.title, locale)}
          </Link>
        ))}
      </nav>
    </div>
  </>
);

export default FooterLinks;
