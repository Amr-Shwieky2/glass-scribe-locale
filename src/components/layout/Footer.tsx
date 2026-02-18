/**
 * Footer Component - Static Content
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import {
  BUSINESS_INFO,
  CONTACT_INFO,
  SERVICES,
  NAVIGATION,
  FOOTER_CONTENT,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

const Footer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  return (
    <footer className="bg-brand-navy text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <img 
                src="/logo.png" 
                alt="Shwaki Brothers Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
              <div>
                <h3 className="font-bold text-base sm:text-lg">
                  {getLocalizedText(BUSINESS_INFO.name, locale)}
                </h3>
              </div>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              {getLocalizedText(FOOTER_CONTENT.description, locale)}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {getLocalizedText(FOOTER_CONTENT.licensedBusiness, locale)}
            </p>
          </div>

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

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-brand-gold">
              {getLocalizedText(FOOTER_CONTENT.contact.title, locale)}
            </h4>
            <div className="space-y-3 sm:space-y-4">
              <a
                href={`tel:${CONTACT_INFO.phoneIntl}`}
                className="flex items-center gap-3 text-gray-400 hover:text-brand-gold transition-colors text-sm sm:text-base py-1"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
                {CONTACT_INFO.phone}
              </a>
              <a
                href={`mailto:${CONTACT_INFO.email}`}
                className="flex items-center gap-3 text-gray-400 hover:text-brand-gold transition-colors text-sm sm:text-base py-1 break-all"
              >
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
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-gray-500 text-xs sm:text-sm">
              {getLocalizedText(FOOTER_CONTENT.copyright, locale)}
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-gray-500 text-xs sm:text-sm">
                {getLocalizedText(BUSINESS_INFO.serviceArea, locale)}
              </span>
              {/* Discreet admin access */}
              <Link
                to="/admin"
                className="text-gray-700 hover:text-gray-500 transition-colors"
                aria-label="Admin"
                title="Admin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
