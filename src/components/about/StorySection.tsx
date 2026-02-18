import React from 'react';
import { CheckCircle } from 'lucide-react';
import {
  BUSINESS_INFO, PAGE_CONTENT, UI_STRINGS,
  getLocalizedText, type SupportedLocale,
} from '@/data';

interface StorySectionProps {
  locale: SupportedLocale;
}

const bulletPoints = [
  { en: 'Licensed and insured business', he: 'עסק מורשה ומבוטח', ar: 'عمل مرخص ومؤمن', ru: 'Лицензированный и застрахованный бизнес' },
  { en: 'Expert craftsmen with years of experience', he: 'אומנים מומחים עם שנות ניסיון', ar: 'حرفيون خبراء بسنوات من الخبرة', ru: 'Опытные мастера с многолетним стажем' },
  { en: 'Premium quality materials only', he: 'חומרים איכותיים בלבד', ar: 'مواد عالية الجودة فقط', ru: 'Только материалы премиум-качества' },
  { en: 'Customer satisfaction guarantee', he: 'ערבות לשביעות רצון הלקוח', ar: 'ضمان رضا العملاء', ru: 'Гарантия удовлетворённости клиентов' },
];

const StorySection: React.FC<StorySectionProps> = ({ locale }) => {
  const content = PAGE_CONTENT.about;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative">
              <div className="aspect-square bg-brand-navy rounded-2xl sm:rounded-3xl flex items-center justify-center">
                <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl">🏗️</span>
              </div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-gold">{BUSINESS_INFO.established}</p>
                <p className="text-gray-600 text-sm sm:text-base">
                  {getLocalizedText(UI_STRINGS.aboutSince, locale)}
                </p>
              </div>
            </div>

            <div className="mt-8 md:mt-0">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-brand-navy">
                {getLocalizedText(UI_STRINGS.aboutOurStory, locale)}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                {getLocalizedText(content.story, locale)}
              </p>
              <div className="space-y-2 sm:space-y-3">
                {bulletPoints.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold flex-shrink-0" />
                    <span className="text-brand-navy/80 text-sm sm:text-base">{getLocalizedText(item, locale)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
