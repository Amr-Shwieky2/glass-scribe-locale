/**
 * Why Choose Us Section - Value Proposition
 * Implements authority signals as recommended in UI/UX strategy
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Ruler, 
  Palette, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  HeartHandshake,
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocalizedText, type SupportedLocale } from '@/data';

interface WhyChooseUsProps {
  locale: SupportedLocale;
  currentLanguage: string;
}

const CONTENT = {
  title: {
    en: 'Why Choose Shwaki Brothers?',
    he: 'למה לבחור באחים שוואקי?',
    ar: 'لماذا تختار شويكي اخوان؟',
    ru: 'Почему выбирают Братьев Шваки?',
  },
  subtitle: {
    en: 'Our commitment to excellence sets us apart',
    he: 'המחויבות שלנו למצוינות מייחדת אותנו',
    ar: 'التزامنا بالتميز يميزنا',
    ru: 'Наша приверженность качеству отличает нас',
  },
  cta: {
    en: 'Get Your Free Quote',
    he: 'קבלו הצעת מחיר חינם',
    ar: 'احصل على عرض أسعار مجاني',
    ru: 'Получить бесплатную оценку',
  },
  ctaSub: {
    en: 'No obligation • Response within 2 hours',
    he: 'ללא התחייבות • מענה תוך שעתיים',
    ar: 'بدون التزام • الرد خلال ساعتين',
    ru: 'Без обязательств • Ответ в течение 2 часов',
  },
};

const FEATURES = [
  {
    icon: Ruler,
    title: {
      en: 'Free On-Site Measurement',
      he: 'מדידה באתר ללא עלות',
      ar: 'قياس مجاني في الموقع',
      ru: 'Бесплатный выезд для замера',
    },
    description: {
      en: 'Professional measurement within 48 hours of your call. We come to your location across Israel.',
      he: 'מדידה מקצועית תוך 48 שעות מהפנייה. אנחנו מגיעים אליכם בכל רחבי הארץ.',
      ar: 'قياس احترافي خلال 48 ساعة من اتصالك. نأتي إلى موقعك في جميع أنحاء إسرائيل.',
      ru: 'Профессиональный замер в течение 48 часов. Выезжаем по всему Израилю.',
    },
  },
  {
    icon: Palette,
    title: {
      en: 'Custom Design Consultation',
      he: 'ייעוץ עיצוב מותאם אישית',
      ar: 'استشارة تصميم مخصصة',
      ru: 'Индивидуальный дизайн-проект',
    },
    description: {
      en: '3D visualization to see your project before installation. We help you choose the perfect glass solution.',
      he: 'ויזואליזציה תלת-ממדית לראות את הפרויקט לפני ההתקנה. נעזור לכם לבחור את פתרון הזכוכית המושלם.',
      ar: 'تصور ثلاثي الأبعاد لرؤية مشروعك قبل التثبيت. نساعدك في اختيار حل الزجاج المثالي.',
      ru: '3D-визуализация проекта до начала работ. Поможем выбрать идеальное решение.',
    },
  },
  {
    icon: Wrench,
    title: {
      en: 'Expert Installation',
      he: 'התקנה מקצועית',
      ar: 'تركيب احترافي',
      ru: 'Профессиональный монтаж',
    },
    description: {
      en: 'Certified technicians with 15+ years of experience. Clean, precise, and efficient installation.',
      he: 'טכנאים מוסמכים עם יותר מ-15 שנות ניסיון. התקנה נקייה, מדויקת ויעילה.',
      ar: 'فنيون معتمدون بخبرة تزيد عن 15 عامًا. تركيب نظيف ودقيق وفعال.',
      ru: 'Сертифицированные мастера с опытом более 15 лет. Чистый и точный монтаж.',
    },
  },
  {
    icon: ShieldCheck,
    title: {
      en: 'Premium Materials Only',
      he: 'חומרים פרימיום בלבד',
      ar: 'مواد متميزة فقط',
      ru: 'Только премиум-материалы',
    },
    description: {
      en: 'We use only tempered safety glass and premium hardware. Israeli standards compliant.',
      he: 'אנו משתמשים רק בזכוכית בטיחותית מחוסמת ואביזרים איכותיים. עומד בתקנים הישראליים.',
      ar: 'نستخدم فقط زجاج الأمان المقسى والأجهزة الممتازة. متوافق مع المعايير الإسرائيلية.',
      ru: 'Только закаленное безопасное стекло и премиум-фурнитура. Соответствует израильским стандартам.',
    },
  },
  {
    icon: Clock,
    title: {
      en: 'Fast Turnaround',
      he: 'זמני אספקה מהירים',
      ar: 'سرعة في التنفيذ',
      ru: 'Быстрые сроки',
    },
    description: {
      en: 'Most projects completed within 5-7 business days from measurement to installation.',
      he: 'רוב הפרויקטים מושלמים תוך 5-7 ימי עסקים ממדידה ועד התקנה.',
      ar: 'يتم إنجاز معظم المشاريع خلال 5-7 أيام عمل من القياس إلى التركيب.',
      ru: 'Большинство проектов завершаются за 5-7 рабочих дней от замера до монтажа.',
    },
  },
  {
    icon: HeartHandshake,
    title: {
      en: '2-Year Full Warranty',
      he: 'אחריות מלאה לשנתיים',
      ar: 'ضمان كامل لمدة عامين',
      ru: 'Полная гарантия 2 года',
    },
    description: {
      en: 'Complete warranty coverage on materials and workmanship. Your satisfaction is guaranteed.',
      he: 'כיסוי אחריות מלא על חומרים ועבודה. שביעות רצונכם מובטחת.',
      ar: 'تغطية ضمان كاملة على المواد والعمل. رضاك مضمون.',
      ru: 'Полное гарантийное покрытие на материалы и работу. Ваше удовлетворение гарантировано.',
    },
  },
];

const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ locale, currentLanguage }) => {
  const t = (obj: Record<string, string>) => getLocalizedText(obj, locale);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-navy mb-3 sm:mb-4">
            {t(CONTENT.title)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-brand-navy/60 max-w-2xl mx-auto">
            {t(CONTENT.subtitle)}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 sm:p-8 bg-brand-light rounded-2xl hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-gold/20 transition-colors">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-gold" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2 sm:mb-3">
                {t(feature.title)}
              </h3>
              <p className="text-sm sm:text-base text-brand-navy/70 leading-relaxed">
                {t(feature.description)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to={`/${currentLanguage}/contact`}
            className="btn-animated-gold-filled inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg mb-3"
          >
            {t(CONTENT.cta)}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="text-sm text-brand-navy/50">
            {t(CONTENT.ctaSub)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
