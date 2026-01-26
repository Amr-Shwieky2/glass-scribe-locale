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
import { Menu, X, Phone, MessageCircle, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { SPRING_CONFIGS } from '@/constants/animation';
import { getWhatsAppLink, getPhoneLink } from '@/constants/contact';
import { useSiteSettings } from '@/lib/strapi/hooks';
import { getStrapiImageUrl } from '@/lib/strapi/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const { data: siteSettings } = useSiteSettings();

  // Get contact info from CMS or fallback to defaults
  const phone = siteSettings?.phone || '+972501234567';
  const whatsApp = siteSettings?.whatsApp || '+972501234567';
  const logoUrl = siteSettings?.logo?.url
    ? getStrapiImageUrl(siteSettings.logo.url)
    : '/logo.png';

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
    const link = `https://wa.me/${whatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(link, '_blank');
  }, [t, whatsApp]);

  // Handle phone call CTA
  const handlePhoneCall = useCallback(() => {
    window.open(`tel:${phone}`, '_blank');
  }, [phone]);

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Advanced scroll effect with spring physics
  const headerSpring = useSpring({
    backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
    backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'blur(12px) saturate(150%)',
    boxShadow: scrolled
      ? '0 4px 12px rgba(0, 0, 0, 0.08)'
      : '0 2px 8px rgba(0, 0, 0, 0.04)',
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
      className="sticky top-0 left-0 right-0 z-50 transition-all duration-300"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Animated Logo */}
          <Link
            to={`/${currentLanguage}`}
            className="group"
            aria-label="Shwaki Glassworks home"
          >
            <animated.div
              style={logoSpring}
              className="flex items-center gap-3 transition-transform"
            >
              <img 
                src={logoUrl} 
                alt={siteSettings?.siteName || 'Shwaki Glassworks'} 
                className="h-12 w-auto object-contain"
              />
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
                    ? 'text-accent font-semibold'
                    : 'text-foreground hover:text-accent'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <span className="relative z-10">{t(`nav.${item.key}`)}</span>
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ${
                    isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs & Language */}
          <div className="flex items-center gap-3">
            {/* Primary Contact CTA */}
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-white font-semibold px-6"
                    aria-label="Contact options"
                  >
                    <Phone className="w-4 h-4 mr-2" aria-hidden="true" />
                    <span>{t('nav.contact')}</span>
                    <ChevronDown className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handlePhoneCall}>
                    <Phone className="w-4 h-4 mr-2" />
                    {t('hero.cta.call')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleWhatsApp}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('hero.cta.whatsapp')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-foreground/70 hover:text-foreground"
                    aria-label="Select language"
                  >
                    <Globe className="w-4 h-4 mr-1" aria-hidden="true" />
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
                      className={currentLanguage === lang.code ? 'bg-accent/10' : ''}
                    >
                      {lang.nativeName}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                <X className="w-5 h-5 text-foreground" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" aria-hidden="true" />
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
                  isActive(item.href) ? 'text-accent' : 'text-foreground/80'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button
                onClick={() => {
                  handlePhoneCall();
                  closeMobileMenu();
                }}
                variant="outline"
                className="w-full justify-center"
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
                className="w-full justify-center bg-accent text-white hover:bg-accent/90"
                aria-label="Contact via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>{t('hero.cta.whatsapp')}</span>
              </Button>
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">{t('nav.language')}</div>
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      switchLanguage(lang.code);
                      closeMobileMenu();
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      currentLanguage === lang.code
                        ? 'bg-accent/10 text-accent font-semibold'
                        : 'text-foreground/70 hover:bg-accent/5'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </animated.header>
  );
};

export default Header;