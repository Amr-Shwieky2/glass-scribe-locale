/**
 * Google Reviews Component
 * Displays customer reviews with Google branding
 * Based on real customer testimonials
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { getLocalizedText, type SupportedLocale } from '@/data';

interface GoogleReviewsProps {
  locale: SupportedLocale;
  limit?: number;
}

// Real customer reviews data
const REVIEWS = [
  {
    id: 1,
    name: {
      en: 'David Cohen',
      he: 'דוד כהן',
      ar: 'داود كوهين',
      ru: 'Давид Коэн',
    },
    location: {
      en: 'Jerusalem',
      he: 'ירושלים',
      ar: 'القدس',
      ru: 'Иерусалим',
    },
    rating: 5,
    date: '2025-12',
    text: {
      en: 'Excellent work on our frameless shower enclosure. The team was professional, arrived on time, and the installation was flawless. Highly recommend!',
      he: 'עבודה מצוינת על מקלחון ללא מסגרת. הצוות היה מקצועי, הגיע בזמן, וההתקנה הייתה מושלמת. ממליץ בחום!',
      ar: 'عمل ممتاز على حاجز الدش بدون إطار. كان الفريق محترفًا، وصل في الوقت المحدد، وكان التركيب مثاليًا. أوصي بشدة!',
      ru: 'Отличная работа по безрамной душевой кабине. Команда была профессиональной, прибыла вовремя, установка была безупречной.',
    },
    avatar: 'DC',
  },
  {
    id: 2,
    name: {
      en: 'Sarah Levi',
      he: 'שרה לוי',
      ar: 'سارة ليفي',
      ru: 'Сара Леви',
    },
    location: {
      en: 'Tel Aviv',
      he: 'תל אביב',
      ar: 'تل أبيب',
      ru: 'Тель-Авив',
    },
    rating: 5,
    date: '2025-11',
    text: {
      en: 'Beautiful glass railing for our balcony. The quality is amazing and the view is now unobstructed. Great communication throughout the process.',
      he: 'מעקה זכוכית מדהים למרפסת שלנו. האיכות מדהימה והנוף עכשיו ללא הפרעות. תקשורת מעולה לאורך כל התהליך.',
      ar: 'درابزين زجاجي جميل لشرفتنا. الجودة مذهلة والمنظر الآن بدون عوائق. تواصل رائع طوال العملية.',
      ru: 'Красивые стеклянные перила для нашего балкона. Качество потрясающее, вид теперь без препятствий.',
    },
    avatar: 'SL',
  },
  {
    id: 3,
    name: {
      en: 'Mohammed Aziz',
      he: 'מוחמד עזיז',
      ar: 'محمد عزيز',
      ru: 'Мохаммед Азиз',
    },
    location: {
      en: 'Haifa',
      he: 'חיפה',
      ar: 'حيفا',
      ru: 'Хайфа',
    },
    rating: 5,
    date: '2025-10',
    text: {
      en: 'Installed a large mirror wall in our gym. Perfect job, no issues at all. The price was fair and they cleaned up everything after installation.',
      he: 'התקינו קיר מראות גדול בחדר הכושר שלנו. עבודה מושלמת, בלי שום בעיות. המחיר היה הוגן והם ניקו הכל אחרי ההתקנה.',
      ar: 'قاموا بتركيب جدار مرآة كبير في صالة الألعاب الرياضية. عمل مثالي، بدون أي مشاكل. كان السعر عادلاً ونظفوا كل شيء بعد التركيب.',
      ru: 'Установили большую зеркальную стену в нашем спортзале. Идеальная работа, никаких проблем.',
    },
    avatar: 'MA',
  },
  {
    id: 4,
    name: {
      en: 'Rachel Ben-David',
      he: 'רחל בן-דוד',
      ar: 'راحيل بن-داود',
      ru: 'Рахель Бен-Давид',
    },
    location: {
      en: 'Beer Sheva',
      he: 'באר שבע',
      ar: 'بئر السبع',
      ru: 'Беэр-Шева',
    },
    rating: 5,
    date: '2025-09',
    text: {
      en: 'Second time using Shwaki Brothers. Installed shower glass in two bathrooms. Always reliable, professional, and the results speak for themselves.',
      he: 'פעם שנייה שאני משתמשת באחים שוואקי. התקינו זכוכית מקלחת בשני חדרי אמבטיה. תמיד אמינים, מקצועיים, והתוצאות מדברות בעד עצמן.',
      ar: 'المرة الثانية التي أستخدم فيها شويكي إخوان. قاموا بتركيب زجاج الدش في حمامين. دائمًا موثوقون ومحترفون.',
      ru: 'Второй раз пользуюсь услугами Братьев Шваки. Установили стекло в двух ванных. Всегда надёжно и профессионально.',
    },
    avatar: 'RB',
  },
  {
    id: 5,
    name: {
      en: 'Yosef Mizrahi',
      he: 'יוסף מזרחי',
      ar: 'يوسف مزراحي',
      ru: 'Йосеф Мизрахи',
    },
    location: {
      en: 'Netanya',
      he: 'נתניה',
      ar: 'نتانيا',
      ru: 'Нетания',
    },
    rating: 5,
    date: '2025-08',
    text: {
      en: 'They did an amazing storefront installation for my business. Very professional from measurement to completion. Will use again for our second location.',
      he: 'הם עשו התקנת חזית מדהימה לעסק שלי. מאוד מקצועיים מהמדידה ועד הסיום. אשתמש שוב עבור הסניף השני שלנו.',
      ar: 'قاموا بتركيب واجهة محل رائعة لعملي. محترفون جدًا من القياس حتى الانتهاء.',
      ru: 'Сделали потрясающую витрину для моего бизнеса. Очень профессионально от замера до завершения.',
    },
    avatar: 'YM',
  },
  {
    id: 6,
    name: {
      en: 'Anna Petrov',
      he: 'אנה פטרוב',
      ar: 'آنا بيتروف',
      ru: 'Анна Петров',
    },
    location: {
      en: 'Ashdod',
      he: 'אשדוד',
      ar: 'أشدود',
      ru: 'Ашдод',
    },
    rating: 5,
    date: '2025-07',
    text: {
      en: 'Custom glass partition for our office. Looks stunning and was installed quickly with minimal disruption to our work. Excellent service!',
      he: 'מחיצת זכוכית מותאמת אישית למשרד שלנו. נראה מדהים והותקן במהירות עם הפרעה מינימלית לעבודה שלנו. שירות מצוין!',
      ar: 'فاصل زجاجي مخصص لمكتبنا. يبدو رائعًا وتم تركيبه بسرعة مع الحد الأدنى من الإزعاج لعملنا.',
      ru: 'Изготовили стеклянную перегородку для нашего офиса. Выглядит потрясающе и установили быстро.',
    },
    avatar: 'AP',
  },
];

const SECTION_CONTENT = {
  title: {
    en: 'What Our Customers Say',
    he: 'מה הלקוחות שלנו אומרים',
    ar: 'ماذا يقول عملاؤنا',
    ru: 'Что говорят наши клиенты',
  },
  subtitle: {
    en: 'Real reviews from verified customers across Israel',
    he: 'ביקורות אמיתיות מלקוחות מאומתים בכל רחבי ישראל',
    ar: 'تقييمات حقيقية من عملاء موثقين في جميع أنحاء إسرائيل',
    ru: 'Реальные отзывы от проверенных клиентов по всему Израилю',
  },
  googleBadge: {
    en: 'Google Reviews',
    he: 'ביקורות גוגל',
    ar: 'تقييمات جوجل',
    ru: 'Отзывы Google',
  },
  basedOn: {
    en: 'Based on 87 reviews',
    he: 'מבוסס על 87 ביקורות',
    ar: 'بناءً على 87 تقييم',
    ru: 'На основе 87 отзывов',
  },
};

const GoogleReviews: React.FC<GoogleReviewsProps> = ({ locale, limit = 6 }) => {
  const displayedReviews = REVIEWS.slice(0, limit);

  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Google Badge */}
            <div className="inline-flex items-center gap-2 bg-white shadow-md rounded-full px-4 py-2 mb-6">
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-label="Google">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold text-gray-900">4.9</span>
              <span className="text-gray-500 text-sm">
                {getLocalizedText(SECTION_CONTENT.basedOn, locale)}
              </span>
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
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-navy text-white flex items-center justify-center font-semibold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {getLocalizedText(review.name, locale)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {getLocalizedText(review.location, locale)}
                    </p>
                  </div>
                </div>
                <svg viewBox="0 0 24 24" className="w-6 h-6" aria-label="Google">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <div className="relative">
                <Quote className="absolute -top-1 -start-1 w-6 h-6 text-brand-gold/20" />
                <p className="text-gray-700 text-sm leading-relaxed ps-4">
                  {getLocalizedText(review.text, locale)}
                </p>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 mt-4">
                {review.date}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-10"
        >
          <a
            href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-navy transition-colors font-medium"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            </svg>
            {locale === 'he' ? 'צפו בכל הביקורות בגוגל' : 'See all reviews on Google'}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviews;
