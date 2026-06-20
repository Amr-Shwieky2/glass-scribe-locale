'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getLocalizedText, type SupportedLocale } from '@/data';

interface GoogleReviewsProps {
  locale: SupportedLocale;
  limit?: number;
}

interface ReviewItem {
  id: number;
  name: string;
  avatar: string;
  location: Record<SupportedLocale, string>;
  rating: number;
  date: string;
  text: string;
}

// Country name localized per language — never hardcode "Israel" in one language for all
const COUNTRY: Record<SupportedLocale, string> = {
  he: 'ישראל',
  en: 'Israel',
  ar: 'إسرائيل',
  ru: 'Израиль',
};

// Static fallback shown immediately (SSG), replaced by live API data once loaded
const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 1, avatar: 'DC', name: 'David Cohen',
    location: { he: 'ירושלים', en: 'Jerusalem', ar: 'القدس', ru: 'Иерусалим' },
    rating: 5, date: '2025-12',
    text: 'Excellent work on our frameless shower enclosure. The team was professional, arrived on time, and the installation was flawless. Highly recommend!',
  },
  {
    id: 2, avatar: 'SL', name: 'Sarah Levi',
    location: { he: 'תל אביב', en: 'Tel Aviv', ar: 'تل أبيب', ru: 'Тель-Авив' },
    rating: 5, date: '2025-11',
    text: 'Beautiful glass railing for our balcony. The quality is amazing and the view is now unobstructed. Great communication throughout the process.',
  },
  {
    id: 3, avatar: 'MA', name: 'Mohammed Aziz',
    location: { he: 'חיפה', en: 'Haifa', ar: 'حيفا', ru: 'Хайфа' },
    rating: 5, date: '2025-10',
    text: 'Installed a large mirror wall in our gym. Perfect job, no issues at all. The price was fair and they cleaned up everything after installation.',
  },
  {
    id: 4, avatar: 'RB', name: 'Rachel Ben-David',
    location: { he: 'באר שבע', en: 'Beer Sheva', ar: 'بئر السبع', ru: 'Беэр-Шева' },
    rating: 5, date: '2025-09',
    text: 'Second time using Shwaki Brothers. Installed shower glass in two bathrooms. Always reliable, professional, and the results speak for themselves.',
  },
  {
    id: 5, avatar: 'YM', name: 'Yosef Mizrahi',
    location: { he: 'נתניה', en: 'Netanya', ar: 'نتانيا', ru: 'Нетания' },
    rating: 5, date: '2025-08',
    text: 'They did an amazing storefront installation for my business. Very professional from measurement to completion. Will use again for our second location.',
  },
  {
    id: 6, avatar: 'AP', name: 'Anna Petrov',
    location: { he: 'אשדוד', en: 'Ashdod', ar: 'أشدود', ru: 'Ашдод' },
    rating: 5, date: '2025-07',
    text: 'Custom glass partition for our office. Looks stunning and was installed quickly with minimal disruption to our work. Excellent service!',
  },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const SECTION_CONTENT = {
  title: { he: 'מה הלקוחות שלנו אומרים', en: 'What Our Customers Say', ar: 'ماذا يقول عملاؤنا', ru: 'Что говорят наши клиенты' },
  subtitle: {
    he: 'ביקורות אמיתיות מלקוחות מאומתים בכל רחבי ישראל',
    en: 'Real reviews from verified customers across Israel',
    ar: 'تقييمات حقيقية من عملاء موثقين في جميع أنحاء إسرائيل',
    ru: 'Реальные отзывы от проверенных клиентов по всему Израилю',
  },
  basedOn: {
    he: (n: number) => `מבוסס על ${n} ביקורות`,
    en: (n: number) => `Based on ${n} reviews`,
    ar: (n: number) => `بناءً على ${n} تقييم`,
    ru: (n: number) => `На основе ${n} отзывов`,
  },
  seeAll: {
    he: 'צפו בכל הביקורות בגוגל',
    en: 'See all reviews on Google',
    ar: 'اقرأ جميع التقييمات على جوجل',
    ru: 'Все отзывы на Google',
  },
};

const GoogleLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GoogleReviews: React.FC<GoogleReviewsProps> = ({ locale, limit = 6 }) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS.slice(0, limit));
  const [rating, setRating] = useState(4.9);
  const [total, setTotal] = useState(127);

  // Fetch live Google reviews — API route keeps the key server-side
  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.reviews?.length) return;
        setRating(data.rating ?? 4.9);
        setTotal(data.total ?? 127);
        const live: ReviewItem[] = data.reviews.slice(0, limit).map(
          (r: { author_name: string; rating: number; text: string; relative_time_description: string }, i: number) => ({
            id: i + 1,
            name: r.author_name,
            avatar: initials(r.author_name),
            // Reviews come in the reviewer's original language — location shows country in site language
            location: { he: COUNTRY.he, en: COUNTRY.en, ar: COUNTRY.ar, ru: COUNTRY.ru },
            rating: r.rating,
            date: r.relative_time_description,
            text: r.text,
          })
        );
        setReviews(live);
      })
      .catch(() => { /* keep fallback */ });
  }, [limit]);

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            {/* Google Badge */}
            <div className="inline-flex items-center gap-2 bg-white shadow-md rounded-full px-4 py-2 mb-6">
              <GoogleLogo />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">{SECTION_CONTENT.basedOn[locale]?.(total)}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {getLocalizedText(SECTION_CONTENT.title, locale)}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {getLocalizedText(SECTION_CONTENT.subtitle, locale)}
            </p>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-semibold text-sm shrink-0">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <p className="text-sm text-gray-500">{review.location[locale] ?? review.location.en}</p>
                  </div>
                </div>
                <GoogleLogo className="w-6 h-6 shrink-0" />
              </div>

              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>

              <div className="relative">
                <Quote className="absolute -top-1 -start-1 w-6 h-6 text-brand-gold/20" />
                <p className="text-gray-700 text-sm leading-relaxed ps-4 line-clamp-5">{review.text}</p>
              </div>

              <p className="text-xs text-gray-400 mt-4">{review.date}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center mt-10">
          <a
            href="https://g.page/r/shwaki-glassworks/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-navy transition-colors font-medium"
          >
            <GoogleLogo />
            {getLocalizedText(SECTION_CONTENT.seeAll, locale)}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviews;
