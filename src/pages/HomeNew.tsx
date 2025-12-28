/**
 * HomeNew Component
 * Premium landing page with advanced animations and interactive elements
 */

import React, { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSpring, animated, useTrail } from '@react-spring/web';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Eye,
  Wrench,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Droplets,
  Shield,
  Store,
  SquareStack,
  Frame,
} from 'lucide-react';
import heroImage from '@/assets/hero-glass-installation.jpg';
import railingImage from '@/assets/glass-railing.jpg';
import storefrontImage from '@/assets/storefront-glass.jpg';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { useGSAPScrollAnimations } from '@/hooks/useGSAPScrollAnimations';
import { SPRING_CONFIGS } from '@/constants/animation';
import { getWhatsAppLink, getPhoneLink } from '@/constants/contact';
import QuickContactForm from '@/components/QuickContactForm';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import type { ServiceItem, StatItem } from '@/types';

/**
 * Number of floating particles in the background
 */
const PARTICLE_COUNT = 20;

/**
 * Home page component with premium animations
 */
const HomeNew: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  
  // Custom hooks
  const { mousePosition, handleMouseMove } = useMouseParallax({ intensity: 20 });
  useGSAPScrollAnimations();

  // WhatsApp handler
  const handleWhatsApp = useCallback(() => {
    const message = `Hello, I'd like a quote for glass installation. Language: ${currentLanguage}`;
    window.open(getWhatsAppLink(message), '_blank');
  }, [currentLanguage]);

  // Phone call handler
  const handlePhoneCall = useCallback(() => {
    window.open(getPhoneLink(), '_blank');
  }, []);

  // Scroll to quote form
  const scrollToQuote = useCallback(() => {
    document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Services configuration
  const services: ServiceItem[] = [
    { key: 'shower', icon: <Droplets className="w-8 h-8 text-blue-600" />, image: heroImage },
    { key: 'railings', icon: <Shield className="w-8 h-8 text-blue-600" />, image: railingImage },
    { key: 'storefronts', icon: <Store className="w-8 h-8 text-blue-600" />, image: storefrontImage },
    { key: 'windows', icon: <Frame className="w-8 h-8 text-blue-600" />, image: heroImage },
    { key: 'mirrors', icon: <SquareStack className="w-8 h-8 text-blue-600" />, image: railingImage },
    { key: 'repairs', icon: <Wrench className="w-8 h-8 text-blue-600" />, image: storefrontImage },
  ];

  // Statistics configuration
  const stats: StatItem[] = [
    { value: '500+', label: 'Premium Installations', icon: CheckCircle },
    { value: '15+', label: 'Years Experience', icon: Clock },
    { value: '98%', label: 'Client Satisfaction', icon: Star },
    { value: '24h', label: 'Response Time', icon: Zap },
  ];

  // Hero entrance animation
  React.useEffect(() => {
    setIsHeroVisible(true);
  }, []);

  const heroSpring = useSpring({
    opacity: isHeroVisible ? 1 : 0,
    transform: isHeroVisible ? 'translateY(0px)' : 'translateY(40px)',
    config: SPRING_CONFIGS.molasses,
  });

  const titleTrail = useTrail(3, {
    opacity: isHeroVisible ? 1 : 0,
    transform: isHeroVisible ? 'translateY(0px)' : 'translateY(60px)',
    config: { mass: 5, tension: 2000, friction: 200 },
  });

  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-slate-50">
      {/* Animated Gradient Mesh Background */}
      <div className="gradient-mesh opacity-20" aria-hidden="true" />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[...Array(PARTICLE_COUNT)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <animated.div
          style={heroSpring}
          className="container mx-auto px-4 py-32 relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {titleTrail.map((style, index) => (
                <animated.div key={index} style={style}>
                  {index === 0 && (
                    <div className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200">
                      <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-700">
                        {t('hero.badge')}
                      </span>
                    </div>
                  )}
                  {index === 1 && (
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                      <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                        {t('hero.title')}
                      </span>
                    </h1>
                  )}
                  {index === 2 && (
                    <p className="text-lg lg:text-xl text-gray-700 max-w-xl leading-relaxed font-medium">
                      {t('hero.subtitle')}
                    </p>
                  )}
                </animated.div>
              ))}

              <animated.div style={titleTrail[2]} className="flex flex-wrap gap-4 pt-4">
                <Button
                  size="lg"
                  className="magnetic group rounded-2xl px-8 py-7 text-base bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                  onClick={scrollToQuote}
                  aria-label="Get a quote"
                >
                  <span>{t('hero.cta.quote')}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWhatsApp}
                  className="magnetic rounded-2xl px-8 py-7 text-base border-2 bg-white hover:bg-gray-50 transition-all"
                  style={{ borderColor: '#25D366', color: '#25D366' }}
                  aria-label="Contact via WhatsApp"
                >
                  <WhatsAppIcon size={20} className="mr-2" />
                  <span>{t('hero.cta.whatsapp')}</span>
                </Button>
              </animated.div>

              {/* Animated Stats */}
              <animated.div
                style={titleTrail[2]}
                className="grid grid-cols-2 gap-6 pt-8"
              >
                {stats.slice(0, 2).map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={`stat-hero-${index}`}
                      className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 spotlight"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-6 h-6 text-blue-600 mb-2" aria-hidden="true" />
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </animated.div>
            </div>

            {/* Hero Image with 3D Transform */}
            <animated.div
              style={{
                ...titleTrail[1],
                transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
              }}
              className="relative"
            >
              <div className="glass-morphism aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <div className="liquid-glow absolute inset-0" aria-hidden="true" />
                <img
                  src={heroImage}
                  alt="Premium architectural glass installation showcase"
                  className="w-full h-full object-cover scale-105 transition-transform duration-700 hover:scale-110"
                  loading="eager"
                />
              </div>

              {/* Floating Badge */}
              <animated.div
                style={titleTrail[2]}
                className="glass-morphism absolute -bottom-8 -left-8 p-6 rounded-2xl shadow-2xl"
                role="complementary"
                aria-label="Experience badge"
              >
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-10 h-10 text-emerald-400" aria-hidden="true" />
                  <div>
                    <div className="text-base font-bold text-white">15+ {t('hero.badge_years')}</div>
                    <div className="text-sm text-gray-400">{t('hero.badge_precision')}</div>
                  </div>
                </div>
              </animated.div>
            </animated.div>
          </div>
        </animated.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 bg-white" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal">
            <h2 id="services-heading" className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {t('services.title')}
              </span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              {t('hero.tagline')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <article
                key={service.key}
                className="blur-reveal card-3d spotlight group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="bg-white h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden image-distort">
                    <img
                      src={service.image}
                      alt={t(`services.${service.key}.title`)}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div aria-hidden="true">{service.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {t(`services.${service.key}.title`)}
                      </h3>
                    </div>
                    <p className="text-gray-600 font-medium">{t(`services.${service.key}.description`)}</p>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-blue-400 hover:text-blue-300 group"
                      aria-label={`Learn more about ${t(`services.${service.key}.title`)}`}
                    >
                      <span>{t('hero.cta.learn_more')}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </Button>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Contact Form */}
      <section id="quote-form" className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-blue-50" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center reveal mb-12">
            <h2 id="cta-heading" className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('cta.heading')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
          </div>

          {/* Quick Contact Form */}
          <div className="max-w-md mx-auto mb-12">
            <QuickContactForm />
          </div>

          {/* Alternative Contact Methods */}
          <div className="flex flex-wrap gap-4 justify-center pt-8 border-t border-gray-200">
            <Button
              size="lg"
              className="magnetic rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleWhatsApp}
              aria-label="Contact via WhatsApp"
              style={{ backgroundColor: '#25D366', color: 'white' }}
            >
              <WhatsAppIcon size={24} className="mr-2" />
              <span>{t('hero.cta.whatsapp')}</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handlePhoneCall}
              className="magnetic rounded-2xl px-8 py-6 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
              aria-label="Call us"
            >
              <Phone className="w-6 h-6 mr-2" aria-hidden="true" />
              <span>{t('hero.cta.call')}</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeNew;
