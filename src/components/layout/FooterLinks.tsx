import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import {
  SERVICES, NAVIGATION, FOOTER_CONTENT,
  getLocalizedText, type SupportedLocale,
} from '@/data';

// Location links for local SEO
const LOCATION_LINKS = [
  { slug: 'jerusalem', label: { he: 'ירושלים', en: 'Jerusalem', ar: 'القدس', ru: 'Иерусалим' } },
  { slug: 'tel-aviv', label: { he: 'תל אביב', en: 'Tel Aviv', ar: 'تل أبيب', ru: 'Тель-Авив' } },
  { slug: 'haifa', label: { he: 'חיפה', en: 'Haifa', ar: 'حيفا', ru: 'Хайфа' } },
  { slug: 'beer-sheva', label: { he: 'באר שבע', en: 'Beer Sheva', ar: 'بئر السبع', ru: 'Беэр-Шева' } },
];

const SERVICE_AREAS_TITLE = {
  he: 'אזורי שירות',
  en: 'Service Areas',
  ar: 'مناطق الخدمة',
  ru: 'Районы обслуживания',
};

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

    {/* Services & Locations */}
    <div className="space-y-6">
      {/* Services */}
      <div>
        <h4 className="font-bold text-base sm:text-lg mb-4 text-brand-gold">
          {getLocalizedText(FOOTER_CONTENT.services.title, locale)}
        </h4>
        <nav className="flex flex-col gap-2 sm:gap-3">
          {SERVICES.slice(0, 4).map((service) => (
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
      
      {/* Location Links - Local SEO */}
      <div>
        <h4 className="font-bold text-base sm:text-lg mb-4 text-brand-gold">
          {getLocalizedText(SERVICE_AREAS_TITLE, locale)}
        </h4>
        <nav className="flex flex-col gap-2 sm:gap-3">
          {LOCATION_LINKS.map((location) => (
            <Link
              key={location.slug}
              to={`/${currentLanguage}/${location.slug}`}
              className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-2 text-sm sm:text-base py-1"
            >
              <MapPin className="w-4 h-4" />
              {getLocalizedText(location.label, locale)}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  </>
);

export default FooterLinks;
