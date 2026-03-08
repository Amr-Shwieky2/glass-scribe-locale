/**
 * Footer Component - Orchestrator
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import FooterLinks from './FooterLinks';
import FooterContact from './FooterContact';
import { BUSINESS_INFO, FOOTER_CONTENT, getLocalizedText, type SupportedLocale } from '@/data';

// Legal links labels
const LEGAL_LINKS = {
  privacy: {
    he: 'מדיניות פרטיות',
    en: 'Privacy Policy',
    ar: 'سياسة الخصوصية',
    ru: 'Политика конфиденциальности',
  },
  terms: {
    he: 'תנאי שימוש',
    en: 'Terms of Use',
    ar: 'شروط الاستخدام',
    ru: 'Условия использования',
  },
  contact: {
    he: 'צור קשר',
    en: 'Contact',
    ar: 'اتصل بنا',
    ru: 'Контакты',
  },
};

const Footer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const t = (obj: Record<string, string>) => getLocalizedText(obj, locale);

  return (
    <footer className="bg-brand-navy text-white">
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <img src="/logo.png" alt="Shwaki Brothers Logo" className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
              <div><h3 className="font-bold text-base sm:text-lg">{getLocalizedText(BUSINESS_INFO.name, locale)}</h3></div>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{getLocalizedText(FOOTER_CONTENT.description, locale)}</p>
            <p className="text-xs sm:text-sm text-gray-500">{getLocalizedText(FOOTER_CONTENT.licensedBusiness, locale)}</p>
          </div>

          <FooterLinks locale={locale} currentLanguage={currentLanguage} />
          <FooterContact locale={locale} />
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-gray-500 text-xs sm:text-sm">{getLocalizedText(FOOTER_CONTENT.copyright, locale)}</p>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
              {/* Legal Links */}
              <Link 
                to={`/${currentLanguage}/privacy`}
                className="text-gray-400 hover:text-brand-gold transition-colors text-xs sm:text-sm"
              >
                {t(LEGAL_LINKS.privacy)}
              </Link>
              <Link 
                to={`/${currentLanguage}/terms`}
                className="text-gray-400 hover:text-brand-gold transition-colors text-xs sm:text-sm"
              >
                {t(LEGAL_LINKS.terms)}
              </Link>
              <Link 
                to={`/${currentLanguage}/contact`}
                className="text-gray-400 hover:text-brand-gold transition-colors text-xs sm:text-sm"
              >
                {t(LEGAL_LINKS.contact)}
              </Link>
              <span className="text-gray-500 text-xs sm:text-sm">{getLocalizedText(BUSINESS_INFO.serviceArea, locale)}</span>
              <Link to="/admin" className="text-gray-700 hover:text-gray-500 transition-colors" aria-label="Admin" title="Admin">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
