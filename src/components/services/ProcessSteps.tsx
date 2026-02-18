import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

interface ProcessStepsProps {
  locale: SupportedLocale;
  currentLanguage: string;
}

const steps = [
  { step: 1, title: { en: 'Consultation', he: 'ייעוץ', ar: 'استشارة', ru: 'Консультация' }, image: '/phone-support.png' },
  { step: 2, title: { en: 'Measurement', he: 'מדידה', ar: 'قياس', ru: 'Замер' }, image: '/measurement.png' },
  { step: 3, title: { en: 'Quote', he: 'הצעת מחיר', ar: 'عرض أسعار', ru: 'Расчёт' }, image: '/admin-work.png' },
  { step: 4, title: { en: 'Installation', he: 'התקנה', ar: 'تركيب', ru: 'Монтаж' }, image: '/installation.png' },
];

const ProcessSteps: React.FC<ProcessStepsProps> = ({ locale, currentLanguage }) => (
  <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12 lg:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-brand-navy">
          {getLocalizedText(UI_STRINGS.processHowWeWork, locale)}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
          {getLocalizedText(UI_STRINGS.processSimple, locale)}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
        {steps.map((item) => (
          <div key={item.step} className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-brand-light rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 shadow-lg overflow-hidden">
              <img src={item.image} alt={`Step ${item.step}`} className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain" />
            </div>
            <div className="font-medium text-brand-gold text-xs sm:text-sm mb-1">
              {`${getLocalizedText(UI_STRINGS.processStep, locale)} ${item.step}`}
            </div>
            <h3 className="font-bold text-brand-navy text-sm sm:text-base">
              {getLocalizedText(item.title, locale)}
            </h3>
          </div>
        ))}
      </div>

      <div className="text-center mt-8 sm:mt-10 lg:mt-12">
        <Link
          to={`/${currentLanguage}/contact`}
          className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
        >
          {getLocalizedText(UI_STRINGS.processFreeQuote, locale)}
          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
      </div>
    </div>
  </section>
);

export default ProcessSteps;
