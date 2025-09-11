import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

const Header = () => {
  const { t } = useTranslation();
  const { isRTL, switchLanguage, supportedLanguages, currentLanguage } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { key: 'home', href: `/${currentLanguage}` },
    { key: 'services', href: `/${currentLanguage}/services` },
    { key: 'projects', href: `/${currentLanguage}/projects` },
    { key: 'process', href: `/${currentLanguage}/process` },
    { key: 'about', href: `/${currentLanguage}/about` },
    { key: 'contact', href: `/${currentLanguage}/contact` }
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleWhatsApp = () => {
    const message = encodeURIComponent(t('hero.cta.whatsapp'));
    window.open(`https://wa.me/972501234567?text=${message}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={`/${currentLanguage}`} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm opacity-80"></div>
            </div>
            <span className="font-bold text-xl text-foreground">GlassMax</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-muted-foreground'
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Language Switcher & CTAs */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-secondary rounded-lg p-1">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    currentLanguage === lang.code
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('tel:+972501234567')}
                className="flex items-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>{t('hero.cta.call')}</span>
              </Button>
              <Button
                size="sm"
                onClick={handleWhatsApp}
                className="cta-button flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('hero.cta.whatsapp')}</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open('tel:+972501234567');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t('hero.cta.call')}</span>
                </Button>
                <Button
                  onClick={() => {
                    handleWhatsApp();
                    setIsMenuOpen(false);
                  }}
                  className="cta-button w-full flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('hero.cta.whatsapp')}</span>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;