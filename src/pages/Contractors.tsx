/**
 * Contractors Page - Static Content
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, FileText, Users, Clock, Award, Phone, MessageCircle, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import {
  CONTACT_INFO,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

const Contractors: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.contractors;

  const handleWhatsApp = () => {
    const message = locale === 'he' 
      ? 'שלום, אני קבלן ומעוניין לדבר על שיתוף פעולה'
      : locale === 'ar'
      ? 'مرحباً، أنا مقاول وأود التحدث عن التعاون'
      : 'Hello, I am a contractor and would like to discuss partnership';
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = () => {
    window.location.href = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
      locale === 'he' ? 'פנייה משותף עסקי' : locale === 'ar' ? 'استفسار من شريك تجاري' : 'Business Partner Inquiry'
    )}`;
  };

  const benefits = [
    {
      icon: Building2,
      title: { en: 'Project Coordination', he: 'תיאום פרויקטים', ar: 'تنسيق المشاريع' },
      description: {
        en: 'Seamless coordination with your construction timeline and other trades on site.',
        he: 'תיאום חלק עם לוח הזמנים של הבנייה שלכם ומקצועות אחרים באתר.',
        ar: 'تنسيق سلس مع الجدول الزمني للبناء والحرف الأخرى في الموقع.',
      },
    },
    {
      icon: FileText,
      title: { en: 'Professional Documentation', he: 'תיעוד מקצועי', ar: 'توثيق احترافي' },
      description: {
        en: 'Detailed shop drawings, specifications, and installation documentation provided.',
        he: 'שרטוטים מפורטים, מפרטים ותיעוד התקנה מסופקים.',
        ar: 'رسومات تفصيلية ومواصفات ووثائق التثبيت مقدمة.',
      },
    },
    {
      icon: Clock,
      title: { en: 'Reliable Scheduling', he: 'לוחות זמנים אמינים', ar: 'جدولة موثوقة' },
      description: {
        en: 'We understand construction timelines and deliver on schedule, every time.',
        he: 'אנו מבינים לוחות זמנים של בנייה ומספקים בזמן, בכל פעם.',
        ar: 'نحن نفهم الجداول الزمنية للبناء ونسلم في الموعد المحدد، في كل مرة.',
      },
    },
    {
      icon: Award,
      title: { en: 'Quality Assurance', he: 'אבטחת איכות', ar: 'ضمان الجودة' },
      description: {
        en: 'All work meets building codes and standards. Licensed and insured.',
        he: 'כל העבודה עומדת בתקני בנייה ותקנות. מורשים ומבוטחים.',
        ar: 'جميع الأعمال تلبي قوانين ومعايير البناء. مرخص ومؤمن.',
      },
    },
    {
      icon: Users,
      title: { en: 'Dedicated Support', he: 'תמיכה ייעודית', ar: 'دعم مخصص' },
      description: {
        en: 'Single point of contact for all your glass installation needs on the project.',
        he: 'נקודת קשר אחת לכל צרכי התקנת הזכוכית בפרויקט.',
        ar: 'نقطة اتصال واحدة لجميع احتياجات تركيب الزجاج في المشروع.',
      },
    },
  ];

  const services = [
    { en: 'Shower enclosures for residential projects', he: 'מארזי מקלחת לפרויקטים למגורים', ar: 'حاويات الدش للمشاريع السكنية' },
    { en: 'Glass railings for balconies and staircases', he: 'מעקות זכוכית למרפסות ומדרגות', ar: 'درابزين زجاجي للشرفات والسلالم' },
    { en: 'Office partitions and glass walls', he: 'מחיצות משרד וקירות זכוכית', ar: 'فواصل مكتبية وجدران زجاجية' },
    { en: 'Storefront and commercial glazing', he: 'חזיתות וזיגוג מסחרי', ar: 'واجهات المتاجر والتزجيج التجاري' },
    { en: 'Custom glass solutions', he: 'פתרונות זכוכית מותאמים', ar: 'حلول زجاجية مخصصة' },
  ];

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <AnimatedPageHeader className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-xs sm:text-sm font-medium text-blue-300">
              🏗️ {locale === 'he' ? 'שותפים עסקיים' : locale === 'ar' ? 'شركاء الأعمال' : 'Business Partners'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(content.title, locale)}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            {getLocalizedText(content.subtitle, locale)}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="bg-green-600 hover:bg-green-700 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </Button>
            <Button
              size="lg"
              onClick={handleEmail}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Mail className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {locale === 'he' ? 'שלחו אימייל' : locale === 'ar' ? 'أرسل بريداً إلكترونياً' : 'Send Email'}
            </Button>
          </div>
        </div>
      </AnimatedPageHeader>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              {locale === 'he' ? 'למה לעבוד איתנו' :
               locale === 'ar' ? 'لماذا تعمل معنا' :
               'Why Work With Us'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {locale === 'he' ? 'אנו מבינים את הצרכים של קבלנים ואדריכלים' :
               locale === 'ar' ? 'نحن نفهم احتياجات المقاولين والمهندسين المعماريين' :
               'We understand the needs of contractors and architects'}
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

      {/* Services for Contractors */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
                {locale === 'he' ? 'השירותים שלנו לקבלנים' :
                 locale === 'ar' ? 'خدماتنا للمقاولين' :
                 'Our Services for Contractors'}
              </h2>
            </div>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="space-y-3 sm:space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 py-2 sm:py-3 border-b last:border-0">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" />
                      <span className="text-base sm:text-lg text-gray-700">
                        {getLocalizedText(service, locale)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-8 sm:mt-10 md:mt-12">
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                {locale === 'he' ? 'שלחו לנו את השרטוטים והמפרטים שלכם לקבלת הצעת מחיר' :
                 locale === 'ar' ? 'أرسل لنا رسوماتك ومواصفاتك للحصول على عرض أسعار' :
                 'Send us your drawings and specifications for a quote'}
              </p>
              <Button size="lg" onClick={handleEmail} className="rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base">
                <Mail className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="truncate">{CONTACT_INFO.email}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {locale === 'he' ? 'בואו נעבוד יחד' :
             locale === 'ar' ? 'دعنا نعمل معاً' :
             'Let\'s Work Together'}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
            {locale === 'he' ? 'יצירת קשר פשוטה - שלחו לנו הודעה או התקשרו ונחזור אליכם תוך 24 שעות' :
             locale === 'ar' ? 'التواصل بسيط - أرسل لنا رسالة أو اتصل وسنعود إليك خلال 24 ساعة' :
             'Getting in touch is simple - send us a message or call and we\'ll get back to you within 24 hours'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full font-bold"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white/10 px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full"
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

export default Contractors;
