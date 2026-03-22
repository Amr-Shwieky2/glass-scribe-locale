/**
 * Process Section - Our Installation Process
 * Structured content for SEO & AI Search Optimization (GEO)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Ruler, PenTool, Truck, CheckCircle } from 'lucide-react';
import { getLocalizedText, type SupportedLocale } from '@/data';

interface ProcessSectionProps {
  locale: SupportedLocale;
}

const CONTENT = {
  title: {
    en: 'Our Simple 5-Step Process',
    he: 'התהליך הפשוט שלנו ב-5 שלבים',
    ar: 'عمليتنا البسيطة في 5 خطوات',
    ru: 'Наш простой процесс из 5 шагов',
  },
  subtitle: {
    en: 'From first call to perfect installation',
    he: 'מהשיחה הראשונה ועד התקנה מושלמת',
    ar: 'من أول مكالمة إلى التركيب المثالي',
    ru: 'От первого звонка до идеального монтажа',
  },
};

const STEPS = [
  {
    icon: Phone,
    number: '1',
    title: {
      en: 'Free Consultation',
      he: 'ייעוץ חינם',
      ar: 'استشارة مجانية',
      ru: 'Бесплатная консультация',
    },
    description: {
      en: 'Call us or send a WhatsApp message. We\'ll discuss your needs and schedule a free measurement visit within 48 hours.',
      he: 'התקשרו או שלחו הודעה בוואטסאפ. נדון בצרכים שלכם ונתאם ביקור מדידה חינם תוך 48 שעות.',
      ar: 'اتصل بنا أو أرسل رسالة واتساب. سنناقش احتياجاتك ونحدد موعد زيارة قياس مجانية خلال 48 ساعة.',
      ru: 'Позвоните или напишите в WhatsApp. Обсудим ваши потребности и назначим бесплатный замер в течение 48 часов.',
    },
    duration: {
      en: '24-48 hours',
      he: '24-48 שעות',
      ar: '24-48 ساعة',
      ru: '24-48 часов',
    },
  },
  {
    icon: Ruler,
    number: '2',
    title: {
      en: 'On-Site Measurement',
      he: 'מדידה באתר',
      ar: 'قياس في الموقع',
      ru: 'Замер на месте',
    },
    description: {
      en: 'Our technician visits your location to take precise measurements. We assess the space and discuss design options.',
      he: 'הטכנאי שלנו מגיע למיקום שלכם לביצוע מדידות מדויקות. אנו בוחנים את המרחב ודנים באפשרויות עיצוב.',
      ar: 'يزور الفني موقعك لأخذ قياسات دقيقة. نقيم المساحة ونناقش خيارات التصميم.',
      ru: 'Наш специалист приезжает для точного замера. Оцениваем пространство и обсуждаем варианты.',
    },
    duration: {
      en: 'Same day',
      he: 'באותו יום',
      ar: 'في نفس اليوم',
      ru: 'В тот же день',
    },
  },
  {
    icon: PenTool,
    number: '3',
    title: {
      en: 'Custom Quote & Design',
      he: 'הצעת מחיר ועיצוב',
      ar: 'عرض أسعار وتصميم',
      ru: 'Индивидуальная смета',
    },
    description: {
      en: 'Receive a detailed quote with no hidden costs. We provide 3D visualization so you can see exactly what you\'ll get.',
      he: 'קבלו הצעת מחיר מפורטת ללא עלויות נסתרות. אנו מספקים ויזואליזציה תלת-ממדית כדי שתראו בדיוק מה תקבלו.',
      ar: 'احصل على عرض أسعار مفصل بدون تكاليف مخفية. نقدم تصورًا ثلاثي الأبعاد حتى ترى بالضبط ما ستحصل عليه.',
      ru: 'Получите детальную смету без скрытых расходов. Предоставляем 3D-визуализацию.',
    },
    duration: {
      en: '1-2 days',
      he: '1-2 ימים',
      ar: '1-2 يوم',
      ru: '1-2 дня',
    },
  },
  {
    icon: Truck,
    number: '4',
    title: {
      en: 'Production & Delivery',
      he: 'ייצור ומשלוח',
      ar: 'الإنتاج والتوصيل',
      ru: 'Производство и доставка',
    },
    description: {
      en: 'Your custom glass is manufactured with precision. We coordinate delivery and installation scheduling at your convenience.',
      he: 'הזכוכית המותאמת שלכם מיוצרת בדייקנות. אנו מתאמים משלוח והתקנה בזמן הנוח לכם.',
      ar: 'يتم تصنيع زجاجك المخصص بدقة. ننسق التسليم وجدولة التثبيت حسب راحتك.',
      ru: 'Ваше стекло изготавливается с точностью. Согласуем удобное время доставки и монтажа.',
    },
    duration: {
      en: '3-5 days',
      he: '3-5 ימים',
      ar: '3-5 أيام',
      ru: '3-5 дней',
    },
  },
  {
    icon: CheckCircle,
    number: '5',
    title: {
      en: 'Expert Installation',
      he: 'התקנה מקצועית',
      ar: 'تركيب احترافي',
      ru: 'Профессиональный монтаж',
    },
    description: {
      en: 'Our certified team installs your glass with precision. Final inspection ensures everything is perfect. Enjoy your new space!',
      he: 'הצוות המוסמך שלנו מתקין את הזכוכית בדייקנות. בדיקה סופית מוודאה שהכל מושלם. תהנו מהמרחב החדש!',
      ar: 'يقوم فريقنا المعتمد بتثبيت الزجاج بدقة. الفحص النهائي يضمن أن كل شيء مثالي. استمتع بمساحتك الجديدة!',
      ru: 'Наша сертифицированная команда устанавливает стекло с точностью. Финальная проверка качества. Наслаждайтесь!',
    },
    duration: {
      en: '1 day',
      he: 'יום אחד',
      ar: 'يوم واحد',
      ru: '1 день',
    },
  },
];

const ProcessSection: React.FC<ProcessSectionProps> = ({ locale }) => {
  const t = (obj: Record<string, string>) => getLocalizedText(obj, locale);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-brand-light text-brand-navy overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-gold mb-3 sm:mb-4">
            {t(CONTENT.title)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t(CONTENT.subtitle)}
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-brand-gold/30" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Step Number & Icon */}
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto relative z-10">
                    <step.icon className="w-7 h-7 sm:w-9 sm:h-9 text-brand-navy" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-navy text-white border-2 border-white rounded-full flex items-center justify-center text-sm font-bold z-20 shadow-sm">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2 sm:mb-3">
                  {t(step.title)}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
                  {t(step.description)}
                </p>
                <div className="inline-flex items-center px-3 py-1 bg-brand-gold/10 rounded-full text-xs sm:text-sm text-brand-gold font-medium border border-brand-gold/20">
                  ⏱ {t(step.duration)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Total Time */}
        <div className="text-center mt-12 sm:mt-16 pt-8 border-t border-gray-200">
          <p className="text-lg sm:text-xl text-gray-600 mb-2">
            {locale === 'he' ? 'סה״כ זמן משיחה ראשונה ועד התקנה מושלמת:' :
             locale === 'ar' ? 'إجمالي الوقت من أول مكالمة إلى التركيب الكامل:' :
             locale === 'ru' ? 'Общее время от первого звонка до полной установки:' :
             'Total time from first call to complete installation:'}
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-brand-gold">
            5-7 {locale === 'he' ? 'ימי עסקים' : locale === 'ar' ? 'أيام عمل' : locale === 'ru' ? 'рабочих дней' : 'business days'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
