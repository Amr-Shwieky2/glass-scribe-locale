/**
 * Trust Section - Authority Signals & Why Choose Us
 * Shows genuine value propositions without fake statistics
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, MapPin, Clock, Sparkles, Ruler, Truck } from 'lucide-react';
import { getLocalizedText, type SupportedLocale } from '@/data';

interface TrustSectionProps {
  locale: SupportedLocale;
}

// Trust badges content - only TRUE facts
const TRUST_CONTENT = {
  title: {
    en: 'Why Choose Us',
    he: 'למה לבחור בנו',
    ar: 'لماذا تختارنا',
    ru: 'Почему выбирают нас',
  },
  subtitle: {
    en: 'Professional Glass Installation Services Across Israel',
    he: 'שירותי התקנת זכוכית מקצועיים בכל רחבי ישראל',
    ar: 'خدمات تركيب زجاج احترافية في جميع أنحاء إسرائيل',
    ru: 'Профессиональные услуги по установке стекла по всему Израилю',
  },
};

// Only TRUE value propositions - no fake numbers
const BADGES = [
  {
    icon: Ruler,
    title: {
      en: 'Free Measurement',
      he: 'מדידה חינם',
      ar: 'قياس مجاني',
      ru: 'Бесплатный замер',
    },
    description: {
      en: 'On-site consultation at no cost',
      he: 'ייעוץ באתר ללא עלות',
      ar: 'استشارة في الموقع بدون تكلفة',
      ru: 'Консультация на месте бесплатно',
    },
  },
  {
    icon: MapPin,
    title: {
      en: 'Nationwide Service',
      he: 'שירות בכל הארץ',
      ar: 'خدمة في جميع أنحاء البلاد',
      ru: 'По всей стране',
    },
    description: {
      en: 'We serve all areas in Israel',
      he: 'אנו משרתים את כל האזורים בישראל',
      ar: 'نخدم جميع المناطق في إسرائيل',
      ru: 'Работаем во всех регионах Израиля',
    },
  },
  {
    icon: Shield,
    title: {
      en: 'Licensed & Insured',
      he: 'מורשה ומבוטח',
      ar: 'مرخص ومؤمن',
      ru: 'Лицензия и страховка',
    },
    description: {
      en: 'Full liability coverage',
      he: 'כיסוי אחריות מלא',
      ar: 'تغطية مسؤولية كاملة',
      ru: 'Полное страхование',
    },
  },
  {
    icon: Award,
    title: {
      en: 'Premium Quality',
      he: 'איכות פרימיום',
      ar: 'جودة عالية',
      ru: 'Премиум качество',
    },
    description: {
      en: 'Top-grade tempered glass',
      he: 'זכוכית מחוסמת מהשורה הראשונה',
      ar: 'زجاج مقسى من الدرجة الأولى',
      ru: 'Закаленное стекло высшего качества',
    },
  },
  {
    icon: Clock,
    title: {
      en: 'Fast Response',
      he: 'מענה מהיר',
      ar: 'استجابة سريعة',
      ru: 'Быстрый отклик',
    },
    description: {
      en: 'Quote within 24 hours',
      he: 'הצעת מחיר תוך 24 שעות',
      ar: 'عرض سعر خلال 24 ساعة',
      ru: 'Расчет в течение 24 часов',
    },
  },
  {
    icon: Sparkles,
    title: {
      en: 'Warranty Included',
      he: 'אחריות כלולה',
      ar: 'ضمان شامل',
      ru: 'Гарантия включена',
    },
    description: {
      en: 'Quality guaranteed',
      he: 'איכות מובטחת',
      ar: 'جودة مضمونة',
      ru: 'Качество гарантировано',
    },
  },
  {
    icon: Truck,
    title: {
      en: 'Professional Installation',
      he: 'התקנה מקצועית',
      ar: 'تركيب احترافي',
      ru: 'Профессиональный монтаж',
    },
    description: {
      en: 'Expert team, clean finish',
      he: 'צוות מומחים, גמר נקי',
      ar: 'فريق خبراء، تشطيب نظيف',
      ru: 'Команда экспертов, чистая работа',
    },
  },
  {
    icon: CheckCircle,
    title: {
      en: 'Custom Solutions',
      he: 'פתרונות מותאמים',
      ar: 'حلول مخصصة',
      ru: 'Индивидуальные решения',
    },
    description: {
      en: 'Tailored to your needs',
      he: 'מותאם לצרכים שלכם',
      ar: 'مصممة حسب احتياجاتك',
      ru: 'Под ваши потребности',
    },
  },
];

const TrustSection: React.FC<TrustSectionProps> = ({ locale }) => {
  const t = (obj: Record<string, string>) => getLocalizedText(obj, locale);

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-2 sm:mb-3">
            {t(TRUST_CONTENT.title)}
          </h2>
          <p className="text-base sm:text-lg text-brand-navy/60 max-w-2xl mx-auto">
            {t(TRUST_CONTENT.subtitle)}
          </p>
        </div>

        {/* Trust Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {BADGES.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="text-center p-4 sm:p-6 bg-brand-light rounded-xl hover:shadow-md transition-shadow"
            >
              <badge.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-brand-gold" />
              <h3 className="text-sm sm:text-base font-semibold text-brand-navy mb-1">
                {t(badge.title)}
              </h3>
              <p className="text-xs sm:text-sm text-brand-navy/60">
                {t(badge.description)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
