import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import {
  SERVICES, PAGE_CONTENT, UI_STRINGS,
  getLocalizedText, getLocalizedArray, type SupportedLocale,
} from '@/data';
import { useServiceCardImages } from '@/hooks/useServiceCardImages';

interface HomeServicesProps {
  locale: SupportedLocale;
  currentLanguage: string;
}

const HomeServices: React.FC<HomeServicesProps> = ({ locale, currentLanguage }) => {
  const content = PAGE_CONTENT.home;
  const { serviceCardImages } = useServiceCardImages();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service) => {
            const serviceImage = serviceCardImages[service.id] || service.image;
            
            return (
              <Link 
                key={service.id} 
                to={`/${currentLanguage}/projects?category=${service.id}`} 
                className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[4/5] sm:aspect-[3/4]"
              >
                {/* Full-size background image */}
                {serviceImage ? (
                  <img 
                    src={serviceImage} 
                    alt={getLocalizedText(service.title, locale)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-navy/80 flex items-center justify-center">
                    <span className="text-6xl opacity-50">{service.icon}</span>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Icon badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-brand-gold/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <span className="text-2xl">{service.icon}</span>
                </div>

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-gold mb-2 drop-shadow-lg">
                    {getLocalizedText(service.title, locale)}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base line-clamp-2 mb-3 drop-shadow">
                    {getLocalizedText(service.description, locale)}
                  </p>
                  
                  {/* Features - hidden on mobile, shown on hover for desktop */}
                  <ul className="hidden sm:block space-y-1 mb-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {getLocalizedArray(service.features, locale).slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center text-xs text-white/80">
                        <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Arrow indicator */}
                  <div className="flex items-center text-brand-gold font-medium text-sm group-hover:gap-2 transition-all duration-300">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {getLocalizedText(UI_STRINGS.viewProjects, locale)}
                    </span>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
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
