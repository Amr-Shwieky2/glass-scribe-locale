/**
 * Location Landing Page (Server Component)
 * City-specific SEO landing pages
 * Optimized for local search: "זגג ירושלים", "glass installation Tel Aviv", etc.
 */

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, CheckCircle, Clock, ArrowRight, Shield } from 'lucide-react';
import { CONTACT_INFO } from '@/data/contact';
import { UI_STRINGS } from '@/data/ui-strings';
import { SERVICES } from '@/data/services';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';
import { LOCATION_COMMON_CONTENT as COMMON_CONTENT, type LocationKey, LOCATIONS } from '@/data/locations';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import LocationJsonLd from '@/components/LocationJsonLd';
import Breadcrumbs from '@/components/Breadcrumbs';

interface LocationPageProps {
  locale: SupportedLocale;
  slug: LocationKey;
}

const LocationPage: React.FC<LocationPageProps> = ({ locale, slug }) => {
  const locationData = LOCATIONS[slug];
  const cityName = getLocalizedText(locationData.name, locale);

  const whatsappHref = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
    locale === 'he'
      ? `שלום, אני מעוניין בשירותי זכוכית ב${cityName}`
      : `Hello, I'm interested in glass services in ${cityName}`
  )}`;
  const callHref = `tel:${CONTACT_INFO.phoneIntl}`;

  return (
    <>
      {/* Location-specific JSON-LD Schema */}
      <LocationJsonLd city={slug} cityName={cityName} locale={locale} />

      {/* Hero Section */}
      <AnimatedPageHeader>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-gold">
            {getLocalizedText(locationData.heroTitle, locale)}
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            {getLocalizedText(locationData.heroSubtitle, locale)}
          </p>
        </div>
      </AnimatedPageHeader>

      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumbs 
            items={[{ label: cityName }]}
            locale={locale}
          />
        </div>

        {/* Stats Bar */}
        <section className="bg-brand-navy py-6">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-gold">{locationData.projectsCount}</div>
                <div className="text-sm text-white/70">
                  {getLocalizedText(COMMON_CONTENT.projectsCompleted, locale)} {getLocalizedText(locationData.name, locale)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-3xl font-bold text-brand-gold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-sm text-white/70">{locale === 'he' ? 'שירות בכל הארץ' : 'Nationwide Service'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-gold">24h</div>
                <div className="text-sm text-white/70">{locale === 'he' ? 'מענה מהיר' : 'Fast Response'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Description */}
                <div data-reveal>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {getLocalizedText(locationData.description, locale)}
                  </p>
                </div>

                {/* Services */}
                <div data-reveal>
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {getLocalizedText(COMMON_CONTENT.servicesTitle, locale)} {getLocalizedText(locationData.name, locale)}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {SERVICES.slice(0, 6).map((service) => (
                      <Link
                        key={service.id}
                        href={`/${locale}/services`}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-brand-gold/10 transition-colors group"
                      >
                        <span className="text-2xl">{service.icon}</span>
                        <span className="font-medium text-gray-800 group-hover:text-brand-navy">
                          {getLocalizedText(service.title, locale)}
                        </span>
                        <ArrowRight className="w-4 h-4 ms-auto text-gray-400 group-hover:text-brand-gold" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Areas Served */}
                <div data-reveal>
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {getLocalizedText(COMMON_CONTENT.areasTitle, locale)}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {(locale === 'he' ? locationData.areasHe : locationData.areas).map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy/5 text-brand-navy rounded-full text-sm"
                      >
                        <MapPin className="w-3 h-3" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why Choose Us */}
                <div data-reveal>
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {getLocalizedText(COMMON_CONTENT.whyChoose, locale)} {getLocalizedText(locationData.name, locale)}
                  </h2>
                  <div className="space-y-4">
                    {COMMON_CONTENT.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-4">
                        <CheckCircle className="w-6 h-6 text-brand-gold flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-brand-navy">
                            {getLocalizedText(benefit.title, locale)}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {getLocalizedText(benefit.description, locale)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div data-reveal>
                  <h2 className="text-2xl font-bold text-brand-navy mb-6">
                    {locale === 'he' ? 'מיקום' : 'Location'}
                  </h2>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={locationData.mapEmbed}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${getLocalizedText(locationData.name, 'en')}`}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* CTA Card */}
                  <div data-reveal className="bg-brand-navy text-white rounded-2xl p-6 shadow-xl"
                  >
                    <h3 className="text-xl font-bold mb-2">
                      {getLocalizedText(COMMON_CONTENT.ctaTitle, locale)}
                    </h3>
                    <p className="text-white/70 text-sm mb-6">
                      {getLocalizedText(COMMON_CONTENT.ctaSubtitle, locale)} {getLocalizedText(locationData.name, locale)}
                    </p>
                    
                    <div className="space-y-3">
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-semibold py-3 rounded-full hover:bg-brand-gold/90 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        {getLocalizedText(UI_STRINGS.whatsapp, locale)}
                      </a>
                      <a
                        href={callHref}
                        className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-medium py-3 rounded-full hover:bg-white/20 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        {CONTACT_INFO.phone}
                      </a>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>{locale === 'he' ? 'מענה תוך שעתיים' : 'Response within 2 hours'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/70 mt-2">
                        <Shield className="w-4 h-4" />
                        <span>{locale === 'he' ? 'ללא התחייבות' : 'No obligation'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div data-reveal style={{ '--reveal-delay': '100ms' } as React.CSSProperties} className="bg-gray-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="w-5 h-5 text-brand-gold" />
                      <span className="font-semibold text-brand-navy">
                        {locale === 'he' ? 'אחריות מלאה' : 'Full Warranty'}
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {locale === 'he' ? 'אחריות שנתיים על עבודה' : '2-year workmanship warranty'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {locale === 'he' ? 'מורשה ומבוטח' : 'Licensed & insured'}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {locale === 'he' ? 'מדידה חינם' : 'Free measurement'}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-br from-brand-navy to-brand-navy/95 text-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-brand-gold">
              {locale === 'he' 
                ? `מחפשים זגג מקצועי ב${getLocalizedText(locationData.name, locale)}?`
                : `Looking for a Professional Glazier in ${getLocalizedText(locationData.name, locale)}?`
              }
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              {locale === 'he'
                ? 'צרו קשר היום לקבלת הצעת מחיר חינם. מענה מהיר, ללא התחייבות.'
                : 'Contact us today for a free quote. Fast response, no obligation.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy font-semibold px-8 py-4 rounded-full hover:bg-brand-gold/90 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {getLocalizedText(UI_STRINGS.whatsapp, locale)}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-medium px-8 py-4 rounded-full hover:bg-white/20 transition-colors"
              >
                {getLocalizedText(UI_STRINGS.ctaContactUs, locale)}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LocationPage;
