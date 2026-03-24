import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getLocalizedText, getLocalizedArray, type SupportedLocale, type ServiceData } from '@/data';
import { UI_STRINGS } from '@/data';

interface ServiceCardProps {
  service: ServiceData;
  locale: SupportedLocale;
  imageUrl?: string;
  targetHref: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, locale, imageUrl, targetHref }) => {
  return (
    <Link 
      to={targetHref} 
      className="group relative block rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 aspect-[4/5] sm:aspect-[3/4]"
    >
      {/* Full-size background image with lazy loading */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={getLocalizedText(service.title, locale)}
          loading="lazy"
          decoding="async"
          width="600"
          height="800"
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
};

export default ServiceCard;
