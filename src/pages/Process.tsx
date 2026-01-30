/**
 * Process Page - Static Content
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import {
  PROCESS_STEPS,
  CONTACT_INFO,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

const Process: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.process;

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,162,77,0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              {getLocalizedText(content.title, locale)}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300">
              {getLocalizedText(content.subtitle, locale)}
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.stepNumber} className="relative">
                {/* Connector Line */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="absolute left-[4.5rem] top-32 w-0.5 h-20 bg-brand-gold hidden md:block" />
                )}

                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 items-center">
                  {/* Step Image - Cartoon Character */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-brand-light rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                      <img 
                        src={step.image} 
                        alt={`Step ${step.stepNumber}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <Card className="flex-1 w-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <span className="text-xs sm:text-sm font-medium text-brand-navy bg-brand-gold/20 px-2 sm:px-3 py-1 rounded-full">
                          {locale === 'he' ? `שלב ${step.stepNumber}` :
                           locale === 'ar' ? `الخطوة ${step.stepNumber}` :
                           `Step ${step.stepNumber}`}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-brand-navy">
                        {getLocalizedText(step.title, locale)}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        {getLocalizedText(step.description, locale)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Process Overview */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-brand-navy">
              {locale === 'he' ? 'התהליך במבט מהיר' :
               locale === 'ar' ? 'العملية في لمحة' :
               'Process at a Glance'}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="text-center p-3 sm:p-4 md:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4">
                  <img 
                    src={step.image} 
                    alt={`Step ${step.stepNumber}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-xs sm:text-sm font-medium text-brand-gold mb-1 sm:mb-2">
                  {locale === 'he' ? `שלב ${step.stepNumber}` :
                   locale === 'ar' ? `${step.stepNumber}` :
                   `${step.stepNumber}`}
                </div>
                <h3 className="font-bold text-brand-navy text-xs sm:text-sm">
                  {getLocalizedText(step.title, locale)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ-like Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12 text-center text-brand-navy">
              {locale === 'he' ? 'שאלות נפוצות' :
               locale === 'ar' ? 'أسئلة شائعة' :
               'Common Questions'}
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  q: { en: 'How long does a typical installation take?', he: 'כמה זמן לוקחת התקנה טיפוסית?', ar: 'كم يستغرق التثبيت النموذجي؟' },
                  a: { en: 'Most installations are completed in 1-2 days, depending on the project scope. Complex projects may take longer.', he: 'רוב ההתקנות מסתיימות תוך 1-2 ימים, תלוי בהיקף הפרויקט. פרויקטים מורכבים עשויים לקחת יותר זמן.', ar: 'يتم إكمال معظم التركيبات في 1-2 أيام، حسب نطاق المشروع. قد تستغرق المشاريع المعقدة وقتاً أطول.' },
                },
                {
                  q: { en: 'Do you provide a warranty?', he: 'האם אתם מספקים אחריות?', ar: 'هل تقدمون ضمان؟' },
                  a: { en: 'Yes, all our work comes with a comprehensive warranty. We stand behind the quality of our installations.', he: 'כן, כל העבודות שלנו כוללות אחריות מקיפה. אנו עומדים מאחורי איכות ההתקנות שלנו.', ar: 'نعم، جميع أعمالنا تأتي مع ضمان شامل. نحن ندعم جودة تركيباتنا.' },
                },
                {
                  q: { en: 'What areas do you serve?', he: 'אילו אזורים אתם משרתים?', ar: 'ما هي المناطق التي تخدمونها؟' },
                  a: { en: 'We serve all of Israel, including Jerusalem, Tel Aviv, Haifa, and surrounding areas.', he: 'אנו משרתים את כל ישראל, כולל ירושלים, תל אביב, חיפה והאזורים הסובבים.', ar: 'نخدم جميع أنحاء إسرائيل، بما في ذلك القدس وتل أبيب وحيفا والمناطق المحيطة.' },
                },
                {
                  q: { en: 'Is the consultation really free?', he: 'האם הייעוץ באמת חינם?', ar: 'هل الاستشارة مجانية حقاً؟' },
                  a: { en: 'Absolutely! We offer free consultations and quotes with no obligation.', he: 'בהחלט! אנו מציעים ייעוץ והצעות מחיר חינם ללא התחייבות.', ar: 'بالتأكيد! نقدم استشارات وعروض أسعار مجانية بدون التزام.' },
                },
              ].map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <h3 className="font-bold text-base sm:text-lg text-brand-navy mb-2 sm:mb-3">
                      {getLocalizedText(faq.q, locale)}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {getLocalizedText(faq.a, locale)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {locale === 'he' ? 'מוכנים להתחיל?' :
             locale === 'ar' ? 'مستعد للبدء؟' :
             'Ready to Start Your Project?'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80">
            {locale === 'he' ? 'צרו קשר היום לייעוץ והצעת מחיר ללא עלות. נשמח לענות על כל שאלה!' :
             locale === 'ar' ? 'اتصل بنا اليوم للحصول على استشارة وعرض أسعار مجاني. يسعدنا الإجابة على أي أسئلة!' :
             'Contact us today for a free consultation and quote. We\'re happy to answer any questions!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full font-bold"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full"
            >
              <a href={`tel:${CONTACT_INFO.phone.mobile}`}>
                <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {CONTACT_INFO.phone.mobile}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Process;
