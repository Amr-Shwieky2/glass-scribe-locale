import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSiteSettings } from '@/lib/strapi/hooks';
import { getStrapiImageUrl } from '@/lib/strapi/client';

const Footer = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { data: siteSettings } = useSiteSettings();

  // Get contact info from CMS or fallback
  const phone = siteSettings?.phone || '+972-50-123-4567';
  const email = siteSettings?.email || 'info@shwaki-glass.co.il';
  const logoUrl = siteSettings?.logo?.url
    ? getStrapiImageUrl(siteSettings.logo.url)
    : '/logo.png';
  const footerText = siteSettings?.footerText || t('footer.about_text');

  const serviceAreas = [
    'Tel Aviv', 'Jerusalem', 'Haifa', 'Herzliya', 'Petah Tikva', 'Ramat Gan'
  ];

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* About Column */}
          <div className="space-y-4">
            <img 
              src={logoUrl} 
              alt={siteSettings?.siteName || 'Shwaki Glassworks'} 
              className="h-16 w-auto object-contain mb-4"
            />
            <p className="text-muted-foreground text-sm leading-relaxed">
              {footerText}
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">{t('footer.contact')}</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <a href={`tel:${phone}`} className="text-sm text-foreground hover:text-accent transition-colors block font-medium">
                    {phone}
                  </a>
                  <span className="text-xs text-muted-foreground">Call anytime</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <div>
                  <a href={`mailto:${email}`} className="text-sm text-foreground hover:text-accent transition-colors block font-medium">
                    {email}
                  </a>
                  <span className="text-xs text-muted-foreground">Email us</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Areas & Hours Column */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-3">{t('footer.areas')}</h3>
              <p className="text-sm text-muted-foreground">
                {serviceAreas.join(' • ')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                {t('footer.hours')}
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Sun-Thu: 8:00-17:00</div>
                <div>Friday: 8:00-14:00</div>
                <div className="text-xs">Saturday: Closed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} Shwaki Glassworks (אחים שוואקי זכוכית). All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link 
              to={`/${currentLanguage}/privacy`} 
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              to={`/${currentLanguage}/terms`} 
              className="text-sm text-muted-foreground hover:text-accent transition-colors"
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