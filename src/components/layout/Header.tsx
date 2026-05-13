'use client';
/**
 * Header Component - Orchestrator
 */

import React, { useState, useCallback, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';;
import { useSpring, animated } from '@react-spring/web';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { SPRING_CONFIGS } from '@/constants/animation';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { BUSINESS_INFO, CONTACT_INFO, NAVIGATION, getLocalizedText, type SupportedLocale } from '@/data';

// Short language codes for display
const langShort: Record<string, string> = {
  he: 'עברית',
  en: 'EN',
  ar: 'عربي',
  ru: 'РУС',
};

const Header: React.FC = () => {
  const { switchLanguage, supportedLanguages, currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const location = { pathname: usePathname(), search: useSearchParams().toString() };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const scrolled = useScrollDetection({ threshold: 20 });

  const navigation = useMemo(
    () => NAVIGATION.items.map(item => ({
      href: item.href === '/' ? `/${currentLanguage}` : `/${currentLanguage}${item.href}`,
      label: getLocalizedText(item.label, locale),
    })),
    [currentLanguage, locale]
  );

  const isActive = useCallback((href: string): boolean => location.pathname === href, [location.pathname]);
  const handleWhatsApp = useCallback(() => { window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank'); }, []);
  const handlePhoneCall = useCallback(() => { window.location.href = `tel:${CONTACT_INFO.phoneIntl}`; }, []);
  const closeMobileMenu = useCallback(() => { setIsMenuOpen(false); }, []);

  // Handle language switch
  const handleLangSwitch = (code: string) => {
    switchLanguage(code);
    setIsLangOpen(false);
  };

  const headerSpring = useSpring({
    backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
    boxShadow: scrolled ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
    config: SPRING_CONFIGS.smooth,
  });

  const logoSpring = useSpring({ transform: scrolled ? 'scale(0.9)' : 'scale(1)', config: SPRING_CONFIGS.wobbly });

  return (
    <animated.header style={headerSpring} className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href={`/${currentLanguage}`} className="group flex-shrink-0">
            <animated.div style={logoSpring} className="flex items-center gap-2 sm:gap-3">
              <img src="/logo-64.png" alt="Shwaki Brothers Logo" width="48" height="48" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <div className="hidden xs:block sm:block">
                <span className="font-bold text-brand-navy text-sm sm:text-base">{getLocalizedText(BUSINESS_INFO.name, locale)}</span>
              </div>
            </animated.div>
          </Link>

          <DesktopNav navigation={navigation} isActive={isActive} locale={locale} supportedLanguages={supportedLanguages} currentLanguage={currentLanguage} onSwitchLanguage={switchLanguage} onWhatsApp={handleWhatsApp} onCall={handlePhoneCall} />

          {/* Mobile: Language + Menu buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Language Switcher - Mobile */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-brand-light hover:bg-gray-200 transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-brand-navy" />
                <span className="text-sm font-medium text-brand-navy">{langShort[currentLanguage]}</span>
                <ChevronDown className={`w-3 h-3 text-brand-navy/60 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Language Dropdown */}
              {isLangOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangOpen(false)} 
                  />
                  {/* Dropdown */}
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border z-50 overflow-hidden min-w-[120px]">
                    {supportedLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangSwitch(lang.code)}
                        className={`w-full flex items-center justify-center px-4 py-3 text-center transition-colors ${
                          currentLanguage === lang.code 
                            ? 'bg-brand-gold/10 text-brand-gold font-semibold' 
                            : 'hover:bg-gray-50 text-brand-navy'
                        }`}
                      >
                        <span className="text-base">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsLangOpen(false); }} 
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <MobileNav navigation={navigation} isActive={isActive} locale={locale} supportedLanguages={supportedLanguages} currentLanguage={currentLanguage} onSwitchLanguage={switchLanguage} onWhatsApp={handleWhatsApp} onCall={handlePhoneCall} onClose={closeMobileMenu} />
      )}
    </animated.header>
  );
};

export default Header;
