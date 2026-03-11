/**
 * Trust Section - Social Proof & Authority Signals
 * Implements trust indicators as recommended in UI/UX strategy
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Award, Clock, CheckCircle, Users, MapPin, Sparkles } from 'lucide-react';
import { getLocalizedText, type SupportedLocale } from '@/data';

interface TrustSectionProps {
  locale: SupportedLocale;
}

// Trust badges content
const TRUST_CONTENT = {
  title: {
    en: 'Why 500+ Customers Trust Us',
    he: 'למה יותר מ-500 לקוחות סומכים עלינו',
    ar: 'لماذا يثق بنا أكثر من 500 عميل',
    ru: 'Почему нам доверяют более 500 клиентов',
  },
  subtitle: {
    en: 'Israel\'s Leading Glass Installation Experts Since 2010',
    he: 'מומחי התקנת זכוכית המובילים בישראל מאז 2010',
    ar: 'خبراء تركيب الزجاج الرائدين في إسرائيل منذ 2010',
    ru: 'Ведущие эксперты по установке стекла в Израиле с 2010 года',
  },
};

const STATS = [
  {
    icon: Users,
    value: '500+',
    label: {
      en: 'Projects Completed',
      he: 'פרויקטים שהושלמו',
      ar: 'مشروع مكتمل',
      ru: 'Выполненных проектов',
    },
  },
  {
    icon: Clock,
    value: '15+',
    label: {
      en: 'Years Experience',
      he: 'שנות ניסיון',
      ar: 'سنوات الخبرة',
      ru: 'Лет опыта',
    },
  },
  {
    icon: Star,
    value: '4.9',
    label: {
      en: 'Google Rating',
      he: 'דירוג גוגל',
      ar: 'تقييم جوجل',
      ru: 'Рейтинг Google',
    },
    suffix: '/5',
  },
  {
    icon: MapPin,
    value: '100%',
    label: {
      en: 'Nationwide Service',
      he: 'שירות בכל הארץ',
      ar: 'خدمة في جميع أنحاء البلاد',
      ru: 'По всей стране',
    },
  },
];

const BADGES = [
  {
    icon: Shield,
    title: {
      en: 'Licensed & Insured',
      he: 'מורשה ומבוטח',
      ar: 'مرخص ومؤمن',
      ru: 'Лицензия и страховка',
    },
  },
  {
    icon: Award,
    title: {
      en: 'Premium Quality Glass',
      he: 'זכוכית באיכות פרימיום',
      ar: 'زجاج بجودة عالية',
      ru: 'Стекло премиум качества',
    },
  },
  {
    icon: CheckCircle,
    title: {
      en: 'Free Measurement',
      he: 'מדידה חינם',
      ar: 'قياس مجاني',
      ru: 'Бесплатный замер',
    },
  },
  {
    icon: Sparkles,
    title: {
      en: '2-Year Warranty',
      he: 'אחריות לשנתיים',
      ar: 'ضمان لمدة سنتين',
      ru: 'Гарантия 2 года',
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
          <p className="text-base sm:text-lg text-brand-navy/60">
            {t(TRUST_CONTENT.subtitle)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {STATS.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 sm:p-6 bg-brand-light rounded-xl"
            >
              <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-brand-gold" />
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy">
                {stat.value}
                {stat.suffix && <span className="text-lg sm:text-xl text-brand-navy/50">{stat.suffix}</span>}
              </div>
              <div className="text-sm sm:text-base text-brand-navy/70 mt-1">
                {t(stat.label)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {BADGES.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-brand-navy/5 rounded-full"
            >
              <badge.icon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" />
              <span className="text-sm sm:text-base font-medium text-brand-navy">
                {t(badge.title)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Google Reviews Badge */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <a
            href="https://g.page/r/shwaki-glassworks/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-brand-navy/10 rounded-xl hover:border-brand-gold/50 transition-colors group"
          >
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-brand-navy">4.9/5</div>
              <div className="text-xs text-brand-navy/60">Google Reviews</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
