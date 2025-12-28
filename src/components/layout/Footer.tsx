import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Globe } from 'lucide-react';
import { BUSINESS_INFO } from '@/constants/contact';

const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/90 rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                <div className="w-4 h-4 bg-white/80 rounded-sm rotate-12" />
              </div>
              <span className="font-bold text-xl text-foreground">Fusion Glassworks</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {t('footer.description', 'Architectural glass solutions for residential, commercial and highrise projects across Israel.')}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <a 
                  href={BUSINESS_INFO.phone.link} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  dir="ltr"
                >
                  {BUSINESS_INFO.phone.display}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <a 
                  href={BUSINESS_INFO.email.link} 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {BUSINESS_INFO.email.address}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-primary" />
                <a 
                  href={BUSINESS_INFO.website.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {BUSINESS_INFO.website.display}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {t('footer.location', 'Central Israel')}
                </span>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.hours')}</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-sm text-muted-foreground">
                  <div>{t('footer.hours_sun_thu', 'Sun-Thu: 8:00-17:00')}</div>
                  <div>{t('footer.hours_friday', 'Friday: 8:00-14:00')}</div>
                  <div>{t('footer.hours_saturday', 'Saturday: Closed')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.areas')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.all_israel')}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            {t('footer.copyright', '© 2024 Fusion Glassworks. All rights reserved.')}
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to={`/${currentLanguage}/privacy`} 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t('footer.privacy', 'Privacy Policy')}
            </Link>
            <Link 
              to={`/${currentLanguage}/terms`} 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t('footer.terms', 'Terms of Service')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;