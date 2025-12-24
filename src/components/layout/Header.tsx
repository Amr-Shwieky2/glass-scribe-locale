/**
 * Header Component
 * Main navigation header with animated scroll effects and language switching
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSpring, animated } from '@react-spring/web';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { SPRING_CONFIGS } from '@/constants/animation';
import { getWhatsAppLink, getPhoneLink } from '@/constants/contact';
import type { NavigationItem } from '@/types';

/**
 * Header component with animated navigation
 */
const Header: React.FC = () => {
  const { t } = useTranslation();
  const { switchLanguage, supportedLanguages, currentLanguage } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrolled = useScrollDetection({ threshold: 20 });
  const headerRef = useRef<HTMLElement>(null);

  // Navigation configuration
  const navigation = useMemo<NavigationItem[]>(
    () => [
      { key: 'home', href: `/${currentLanguage}` },
      { key: 'services', href: `/${currentLanguage}/services` },
      { key: 'projects', href: `/${currentLanguage}/projects` },
      { key: 'contractors', href: `/${currentLanguage}/contractors` },
      { key: 'process', href: `/${currentLanguage}/process` },
      { key: 'about', href: `/${currentLanguage}/about` },
      { key: 'contact', href: `/${currentLanguage}/contact` },
    ],
    [currentLanguage]
  );

  // Check if navigation item is active
  const isActive = useCallback(
    (href: string): boolean => location.pathname === href,
    [location.pathname]
  );

  // Handle WhatsApp CTA
  const handleWhatsApp = useCallback(() => {
    const message = t('hero.cta.whatsapp');
    window.open(getWhatsAppLink(message), '_blank');
  }, [t]);

  // Handle phone call CTA
  const handlePhoneCall = useCallback(() => {
    window.open(getPhoneLink(), '_blank');
  }, []);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Advanced scroll effect with spring physics
  const headerSpring = useSpring({
    backgroundColor: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'rgba(10, 10, 15, 0.7)',
    backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'blur(16px) saturate(150%)',
    boxShadow: scrolled
      ? '0 8px 32px rgba(0, 0, 0, 0.6)'
      : '0 4px 16px rgba(0, 0, 0, 0.2)',
    transform: scrolled ? 'translateY(0px)' : 'translateY(0px)',
    config: SPRING_CONFIGS.smooth,
  });

  const logoSpring = useSpring({
    transform: scrolled ? 'scale(0.9)' : 'scale(1)',
    config: SPRING_CONFIGS.wobbly,
  });


  return (
    <animated.header
      ref={headerRef}
      style={headerSpring}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Animated Logo */}
          <Link
            to={`/${currentLanguage}`}
            className="group"
            aria-label="Fusion Glassworks home"
          >
            <animated.div
              style={logoSpring}
              className="flex items-center gap-3 transition-transform"
            >
              <div className="relative">
                <div className="glass-morphism w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/50 transition-all duration-500">
                  <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" aria-hidden="true" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">
                  Fusion
                </span>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Glassworks
                </span>
              </div>
            </animated.div>
          </Link>

          {/* Desktop Navigation with Magnetic Effect */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary navigation">
            {navigation.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`magnetic group relative text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-blue-400'
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="relative z-10">{t(`nav.${item.key}`)}</span>
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Language Switcher & CTAs */}
          <div className="flex items-center gap-4">
            {/* Animated Language Switcher */}
            <div className="glass-morphism flex items-center gap-1 rounded-full p-1" role="group" aria-label="Language selector">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
                    currentLanguage === lang.code
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  aria-label={`Switch to ${lang.name}`}
                  aria-current={currentLanguage === lang.code ? 'true' : undefined}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>

            {/* Premium CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePhoneCall}
                className="magnetic glass-morphism hover:scale-105 transition-all duration-300 text-white border-0"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>{t('hero.cta.call')}</span>
              </Button>
              <Button
                size="sm"
                onClick={handleWhatsApp}
                className="cta-premium magnetic hover:scale-105 transition-all duration-300"
                aria-label="Contact via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>{t('hero.cta.whatsapp')}</span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden glass-morphism p-3 rounded-xl hover:scale-110 transition-transform duration-300"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 text-white" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden py-6 space-y-4 animate-in slide-in-from-top duration-300"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                onClick={closeMobileMenu}
                className={`block text-base font-medium transition-colors ${
                  isActive(item.href) ? 'text-blue-400' : 'text-gray-300'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => {
                  handlePhoneCall();
                  closeMobileMenu();
                }}
                className="glass-morphism w-full justify-center border-0 text-white"
                aria-label="Call us"
              >
                <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>{t('hero.cta.call')}</span>
              </Button>
              <Button
                onClick={() => {
                  handleWhatsApp();
                  closeMobileMenu();
                }}
                className="cta-premium w-full justify-center"
                aria-label="Contact via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>{t('hero.cta.whatsapp')}</span>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </animated.header>
  );
};

export default Header;