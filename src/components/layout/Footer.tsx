import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const serviceAreas = [
    'Tel Aviv', 'Jerusalem', 'Haifa', 'Herzliya', 'Petah Tikva', 'Ramat Gan'
  ];

  return (
    <footer className="bg-gray-50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm opacity-80"></div>
              </div>
              <span className="font-bold text-xl text-foreground">GlassMax</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Professional glass installation services with over 15 years of experience in Israel.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+972501234567" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  +972-50-123-4567
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:info@glassmax.co.il" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  info@glassmax.co.il
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Central Israel
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
                  <div>Sun-Thu: 8:00-17:00</div>
                  <div>Friday: 8:00-14:00</div>
                  <div>Saturday: Closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">{t('footer.areas')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {serviceAreas.map((area) => (
                <span key={area} className="text-sm text-muted-foreground">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 GlassMax. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <Link 
              to={`/${currentLanguage}/privacy`} 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to={`/${currentLanguage}/terms`} 
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;