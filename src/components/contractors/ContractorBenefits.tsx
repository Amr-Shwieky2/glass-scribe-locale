import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, FileText, Users, Clock, Award } from 'lucide-react';
import { UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

interface ContractorBenefitsProps {
  locale: SupportedLocale;
}

const benefits = [
  {
    icon: Building2,
    title: { en: 'Project Coordination', he: 'תיאום פרויקטים', ar: 'تنسيق المشاريع', ru: 'Координация проектов' },
    description: { en: 'Seamless coordination with your construction timeline and other trades on site.', he: 'תיאום חלק עם לוח הזמנים של הבנייה שלכם ומקצועות אחרים באתר.', ar: 'تنسيق سلس مع الجدول الزمني للبناء والحرف الأخرى في الموقع.', ru: 'Бесперебойная координация с графиком строительства и другими подрядчиками на объекте.' },
  },
  {
    icon: FileText,
    title: { en: 'Professional Documentation', he: 'תיעוד מקצועי', ar: 'توثيق احترافي', ru: 'Профессиональная документация' },
    description: { en: 'Detailed shop drawings, specifications, and installation documentation provided.', he: 'שרטוטים מפורטים, מפרטים ותיעוד התקנה מסופקים.', ar: 'رسومات تفصيلية ومواصفات ووثائق التثبيت مقدمة.', ru: 'Детальные чертежи, спецификации и документация по монтажу.' },
  },
  {
    icon: Clock,
    title: { en: 'Reliable Scheduling', he: 'לוחות זמנים אמינים', ar: 'جدولة موثوقة', ru: 'Надёжные сроки' },
    description: { en: 'We understand construction timelines and deliver on schedule, every time.', he: 'אנו מבינים לוחות זמנים של בנייה ומספקים בזמן, בכל פעם.', ar: 'نحن نفهم الجداول الزمنية للبناء ونسلم في الموعد المحدد، في كل مرة.', ru: 'Мы понимаем сроки строительства и всегда выполняем работу в срок.' },
  },
  {
    icon: Award,
    title: { en: 'Quality Assurance', he: 'אבטחת איכות', ar: 'ضمان الجودة', ru: 'Гарантия качества' },
    description: { en: 'All work meets building codes and standards. Licensed and insured.', he: 'כל העבודה עומדת בתקני בנייה ותקנות. מורשים ומבוטחים.', ar: 'جميع الأعمال تلبي قوانين ومعايير البناء. مرخص ومؤمن.', ru: 'Все работы соответствуют строительным нормам. Лицензировано и застраховано.' },
  },
  {
    icon: Users,
    title: { en: 'Dedicated Support', he: 'תמיכה ייעודית', ar: 'دعم مخصص', ru: 'Персональная поддержка' },
    description: { en: 'Single point of contact for all your glass installation needs on the project.', he: 'נקודת קשר אחת לכל צרכי התקנת הזכוכית בפרויקט.', ar: 'نقطة اتصال واحدة لجميع احتياجات تركيب الزجاج في المشروع.', ru: 'Единая точка контакта по всем вопросам монтажа стекла на объекте.' },
  },
];

const ContractorBenefits: React.FC<ContractorBenefitsProps> = ({ locale }) => (
  <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
          {getLocalizedText(UI_STRINGS.contractorsWhyWork, locale)}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {getLocalizedText(UI_STRINGS.contractorsUnderstand, locale)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-5 sm:p-6 md:p-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">
                  {getLocalizedText(benefit.title, locale)}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                  {getLocalizedText(benefit.description, locale)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </section>
);

export default ContractorBenefits;
