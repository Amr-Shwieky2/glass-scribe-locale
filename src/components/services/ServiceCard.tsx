import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';
import {
  getLocalizedText, getLocalizedArray, type SupportedLocale, type ServiceData,
} from '@/data';
import { UI_STRINGS } from '@/data';

interface ServiceCardProps {
  service: ServiceData;
  locale: SupportedLocale;
  imageUrl?: string;
  onGetQuote: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, locale, imageUrl, onGetQuote }) => (
  <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
    <CardContent className="p-0">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-gradient-to-br from-brand-navy to-brand-navy/80 relative min-h-[160px] sm:min-h-[200px] overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={getLocalizedText(service.title, locale)}
              className="w-full h-full object-cover absolute inset-0"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8">
              <span className="text-5xl sm:text-6xl mb-3 sm:mb-4">{service.icon}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
          <div className="absolute bottom-3 right-3 w-10 h-10 sm:w-12 sm:h-12 bg-brand-gold/90 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-lg">
            {service.icon}
          </div>
        </div>

        <div className="md:w-2/3 p-5 sm:p-6 md:p-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-brand-navy">
            {getLocalizedText(service.title, locale)}
          </h3>
          <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
            {getLocalizedText(service.description, locale)}
          </p>
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {getLocalizedArray(service.features, locale).map((feature, i) => (
              <div key={i} className="flex items-center text-brand-navy/80 text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold mr-2 sm:mr-3 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <button onClick={onGetQuote} className="btn-animated-navy inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base">
            {getLocalizedText(UI_STRINGS.getQuote, locale)}
            <ArrowRight className="ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default ServiceCard;
