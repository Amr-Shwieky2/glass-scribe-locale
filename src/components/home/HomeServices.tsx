import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  SERVICES, PAGE_CONTENT, UI_STRINGS,
  getLocalizedText, getLocalizedArray, type SupportedLocale,
} from '@/data';

interface HomeServicesProps {
  locale: SupportedLocale;
  currentLanguage: string;
}

const HomeServices: React.FC<HomeServicesProps> = ({ locale, currentLanguage }) => {
  const content = PAGE_CONTENT.home;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-brand-navy">
            {getLocalizedText(content.sections.services.title, locale)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-brand-navy/70 max-w-2xl mx-auto px-2">
            {getLocalizedText(content.sections.services.subtitle, locale)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {SERVICES.map((service) => (
            <Link key={service.id} to={`/${currentLanguage}/projects?category=${service.id}`} className="service-card-animated block">
              <div className="card-inner">
                <div className="service-card-dots">
                  <span className="service-card-dot red"></span>
                  <span className="service-card-dot yellow"></span>
                  <span className="service-card-dot green"></span>
                </div>
                <div className="card-image">
                  {service.image ? (
                    <img src={service.image} alt={getLocalizedText(service.title, locale)} />
                  ) : (
                    <div className="w-full h-full bg-brand-navy/50 flex items-center justify-center">
                      <span className="text-4xl">{service.icon}</span>
                    </div>
                  )}
                  <span className="card-icon">{service.icon}</span>
                </div>
                <div className="card-content">
                  <h3 className="card-title">{getLocalizedText(service.title, locale)}</h3>
                  <p className="card-description">{getLocalizedText(service.description, locale)}</p>
                  <ul className="card-features">
                    {getLocalizedArray(service.features, locale).slice(0, 3).map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-arrow"><ArrowRight className="w-5 h-5" /></div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10 lg:mt-12">
          <Link to={`/${currentLanguage}/services`} className="btn-animated-navy inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
            {getLocalizedText(UI_STRINGS.viewAll, locale)}
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeServices;
