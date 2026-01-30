/**
 * Header Component - Static Navigation
 * Uses static business data for all content
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle, Globe, ChevronDown } from 'lucide-react';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { SPRING_CONFIGS } from '@/constants/animation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BUSINESS_INFO,
  CONTACT_INFO,
  NAVIGATION,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

const Header: React.FC = () => {
  const { switchLanguage, supportedLanguages, currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScrollDetection({ threshold: 20 });

  // Navigation items from static data
  const navigation = useMemo(
    () => NAVIGATION.items.map(item => ({
      href: item.href === '/' ? `/${currentLanguage}` : `/${currentLanguage}${item.href}`,
      label: getLocalizedText(item.label, locale),
    })),
    [currentLanguage, locale]
  );

  const isActive = useCallback(
    (href: string): boolean => location.pathname === href,
    [location.pathname]
  );

  const handleWhatsApp = useCallback(() => {
    const phone = CONTACT_INFO.whatsapp;
    window.open(`https://wa.me/${phone}`, '_blank');
  }, []);

  const handlePhoneCall = useCallback(() => {
    window.location.href = `tel:${CONTACT_INFO.phone.mobile}`;
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const headerSpring = useSpring({
    backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
    boxShadow: scrolled
      ? '0 4px 12px rgba(0, 0, 0, 0.08)'
      : '0 2px 8px rgba(0, 0, 0, 0.04)',
    config: SPRING_CONFIGS.smooth,
  });

  const logoSpring = useSpring({
    transform: scrolled ? 'scale(0.9)' : 'scale(1)',
    config: SPRING_CONFIGS.wobbly,
  });

  return (
    <animated.header
      style={headerSpring}
      className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to={`/${currentLanguage}`} className="group flex-shrink-0">
            <animated.div style={logoSpring} className="flex items-center gap-2 sm:gap-3">
              <img 
                src="/logo.png" 
                alt="Shwaki Brothers Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <div className="hidden xs:block sm:block">
                <span className="font-bold text-brand-navy text-sm sm:text-base">
                  {getLocalizedText(BUSINESS_INFO.name, locale)}
                </span>
              </div>
            </animated.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  isActive(item.href)
                    ? 'text-brand-gold font-semibold'
                    : 'text-brand-navy hover:text-brand-gold'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs & Language */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              {/* Contact Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-semibold px-6 rounded-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{getLocalizedText(NAVIGATION.cta.label, locale)}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handlePhoneCall}>
                    <Phone className="w-4 h-4 mr-2" />
                    {locale === 'he' ? 'התקשר עכשיו' : locale === 'ar' ? 'اتصل الآن' : 'Call Now'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleWhatsApp}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-brand-navy">
                    <Globe className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">
                      {supportedLanguages.find(l => l.code === currentLanguage)?.nativeName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  {supportedLanguages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={currentLanguage === lang.code ? 'bg-brand-gold/10' : ''}
                    >
                      {lang.nativeName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <nav className="flex flex-col gap-2 sm:gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`text-base sm:text-lg font-medium py-2 sm:py-3 px-2 rounded-lg transition-colors ${
                    isActive(item.href) ? 'text-brand-gold bg-brand-gold/5' : 'text-brand-navy hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="border-t pt-4 mt-2 sm:mt-4">
                <p className="text-sm text-gray-500 mb-2 px-2">
                  {locale === 'he' ? 'בחר שפה' : locale === 'ar' ? 'اختر اللغة' : 'Select Language'}
                </p>
                <div className="flex flex-wrap gap-2 px-2">
                  {supportedLanguages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={currentLanguage === lang.code ? 'default' : 'outline'}
                      size="sm"
                      className="flex-1 min-w-[80px]"
                      onClick={() => {
                        switchLanguage(lang.code);
                        closeMobileMenu();
                      }}
                    >
                      {lang.nativeName}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mobile Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 px-2">
                <Button onClick={handlePhoneCall} className="flex-1 h-12" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  {locale === 'he' ? 'התקשר' : locale === 'ar' ? 'اتصل' : 'Call'}
                </Button>
                <Button onClick={handleWhatsApp} className="flex-1 h-12 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </animated.header>
  );
};

export default Header;
