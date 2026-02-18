/**
 * About Page - Orchestrator
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import StorySection from '@/components/about/StorySection';
import OwnerSection from '@/components/about/OwnerSection';
import { WHY_CHOOSE_US, PAGE_CONTENT, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

const About: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.about;

  return (
    <div className="min-h-screen">
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">{getLocalizedText(content.title, locale)}</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">{getLocalizedText(content.subtitle, locale)}</p>
        </div>
      </AnimatedPageHeader>

      <StorySection locale={locale} />

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            {content.stats.map((stat, index) => (
              <div key={index} className="p-4 sm:p-6 md:p-8">
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 sm:mb-4">{stat.value}</p>
                <p className="text-base sm:text-lg md:text-xl opacity-90">{getLocalizedText(stat.label, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-brand-navy">{getLocalizedText(PAGE_CONTENT.home.sections.whyUs.title, locale)}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">{getLocalizedText(PAGE_CONTENT.home.sections.whyUs.subtitle, locale)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {WHY_CHOOSE_US.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-5 sm:p-6 md:p-8 text-center">
                  <div className="text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">{item.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-brand-navy">{getLocalizedText(item.title, locale)}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{getLocalizedText(item.description, locale)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <OwnerSection locale={locale} />

      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{getLocalizedText(UI_STRINGS.ctaReadyToWork, locale)}</h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80">{getLocalizedText(UI_STRINGS.ctaVisionToReality, locale)}</p>
          <Link to={`/${currentLanguage}/contact`} className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg">
            {getLocalizedText(UI_STRINGS.ctaContactUs, locale)}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
