import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Mail } from 'lucide-react';
import { CONTACT_INFO } from '@/data/contact';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

const services = [
  { en: 'Shower enclosures for residential projects', he: 'מארזי מקלחת לפרויקטים למגורים', ar: 'حاويات الدش للمشاريع السكنية', ru: 'Душевые кабины для жилых проектов' },
  { en: 'Glass railings for balconies and staircases', he: 'מעקות זכוכית למרפסות ומדרגות', ar: 'درابزين زجاجي للشرفات والسلالم', ru: 'Стеклянные ограждения для балконов и лестниц' },
  { en: 'Office partitions and glass walls', he: 'מחיצות משרד וקירות זכוכית', ar: 'فواصل مكتبية وجدران زجاجية', ru: 'Офисные перегородки и стеклянные стены' },
  { en: 'Storefront and commercial glazing', he: 'חזיתות וזיגוג מסחרי', ar: 'واجهات المتاجر والتزجيج التجاري', ru: 'Витрины и коммерческое остекление' },
  { en: 'Custom glass solutions', he: 'פתרונות זכוכית מותאמים', ar: 'حلول زجاجية مخصصة', ru: 'Индивидуальные стеклянные решения' },
];

const ContractorServices: React.FC<{ locale: SupportedLocale }> = ({ locale }) => (
  <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">{getLocalizedText(UI_STRINGS.contractorsOurServices, locale)}</h2>
        </div>
        <Card className="border-0 shadow-xl"><CardContent className="p-4 sm:p-6 md:p-8">
          <div className="space-y-3 sm:space-y-4">
            {services.map((s, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 py-2 sm:py-3 border-b last:border-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                <span className="text-base sm:text-lg text-gray-700">{getLocalizedText(s, locale)}</span>
              </div>
            ))}
          </div>
        </CardContent></Card>
        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{getLocalizedText(UI_STRINGS.contractorsSendDrawings, locale)}</p>
          <Button size="lg" asChild className="rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
            <a href={`mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(getLocalizedText(UI_STRINGS.contractorsEmailSubject, locale))}`}>
              <Mail className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /><span className="truncate">{CONTACT_INFO.email}</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default ContractorServices;
