'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BLOG_POSTS, getLocalizedText, type SupportedLocale } from '@/data';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import Breadcrumbs from '@/components/Breadcrumbs';

// Per-category visual identity
const CATEGORY_STYLES: Record<string, { gradient: string; icon: string; badge: string }> = {
  Guides:      { gradient: 'from-blue-600 to-indigo-700',   icon: '📖', badge: 'bg-blue-100 text-blue-800' },
  Pricing:     { gradient: 'from-emerald-600 to-teal-700',  icon: '💰', badge: 'bg-emerald-100 text-emerald-800' },
  Education:   { gradient: 'from-amber-500 to-orange-600',  icon: '💡', badge: 'bg-amber-100 text-amber-800' },
  Maintenance: { gradient: 'from-cyan-600 to-sky-700',      icon: '🔧', badge: 'bg-cyan-100 text-cyan-800' },
  Design:      { gradient: 'from-rose-500 to-pink-600',     icon: '🎨', badge: 'bg-rose-100 text-rose-800' },
};

const DEFAULT_STYLE = { gradient: 'from-brand-navy to-slate-700', icon: '📝', badge: 'bg-gray-100 text-gray-700' };

const BlogList: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  return (
    <>
      <title>{{ he: 'בלוג ומדריכים | אחים שוואקי זכוכית', en: 'Blog & Guides | Shwaki Brothers Glassworks', ar: 'المدونة والأدلة | إخوة شواكي للزجاج', ru: 'Блог и руководства | Братья Шваки' }[locale]}</title>
      <meta name="description" content={{ he: 'קראו את המדריכים המקצועיים שלנו בנושאי התקנת מקלחונים, זכוכית, מעקות וטרנדים בעיצוב הבית בגובה העיניים.', en: 'Read our professional guides on glass installation, shower enclosures, railings, and home design trends.', ar: 'اقرأ أدلتنا المهنية حول تركيب الزجاج وكابينات الدش والدرابزين واتجاهات تصميم المنازل.', ru: 'Читайте наши профессиональные руководства по установке стекла, душевых кабин, ограждений и тенденциям дизайна.' }[locale]} />
      <link rel="canonical" href={`https://www.shwakiglassworks.com/${locale}/blog`} />

      <AnimatedPageHeader>
        <div className="text-center max-w-3xl mx-auto">
          <BookOpen className="w-12 h-12 mx-auto text-brand-gold mb-4" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-gold">
            {{ he: 'בלוג ומדריכים מקצועיים', en: 'Blog & Professional Guides', ar: 'المدونة والأدلة المهنية', ru: 'Блог и профессиональные руководства' }[locale]}
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            {{ he: 'כל מה שרציתם לדעת על עולם הזכוכית, מקלחונים, מעקות ועיצוב פנים', en: 'Everything you wanted to know about glass, showers, railings, and interior design', ar: 'كل ما أردت معرفته عن عالم الزجاج والدشات والدرابزين وتصميم الديكور', ru: 'Всё, что вы хотели знать о стекле, душевых кабинах, ограждениях и дизайне интерьера' }[locale]}
          </p>
        </div>
      </AnimatedPageHeader>

      <div className="min-h-screen bg-gray-50 py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: { he: 'בלוג', en: 'Blog', ar: 'المدونة', ru: 'Блог' }[locale] ?? 'Blog' }
            ]}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {BLOG_POSTS.map((post, index) => {
              const style = CATEGORY_STYLES[post.category] ?? DEFAULT_STYLE;
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col group overflow-hidden"
                >
                  {/* Thumbnail */}
                  <Link href={`/${locale}/blog/${post.slug}`} className="block relative h-52 overflow-hidden" tabIndex={-1} aria-hidden>
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} transition-transform duration-500 group-hover:scale-105`} />
                    {/* Decorative glass-panel lines */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 left-4 right-4 bottom-4 border border-white/60 rounded-xl" />
                      <div className="absolute top-8 left-8 right-8 bottom-8 border border-white/40 rounded-lg" />
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                      <span className="text-5xl drop-shadow-lg select-none">{style.icon}</span>
                      <p className="text-white font-semibold text-center text-sm leading-snug line-clamp-2 drop-shadow">
                        {getLocalizedText(post.title, locale)}
                      </p>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Meta row */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString(
                          { he: 'he-IL', en: 'en-US', ar: 'ar-SA', ru: 'ru-RU' }[locale] ?? 'en-US',
                          { year: 'numeric', month: 'short', day: 'numeric' }
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400 ms-auto">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-brand-navy mb-3 leading-snug group-hover:text-brand-gold transition-colors line-clamp-2">
                      <Link href={`/${locale}/blog/${post.slug}`}>
                        {getLocalizedText(post.title, locale)}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-grow mb-5">
                      {getLocalizedText(post.excerpt, locale)}
                    </p>

                    {/* Footer */}
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-navy transition-colors group/link"
                    >
                      {{ he: 'קראו את המאמר המלא', en: 'Read full article', ar: 'اقرأ المقال كاملاً', ru: 'Читать статью' }[locale]}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1 rtl:rotate-180 rtl:group-hover/link:-translate-x-1" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;
