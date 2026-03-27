import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BLOG_POSTS, getLocalizedText, type SupportedLocale } from '@/data';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import Breadcrumbs from '@/components/Breadcrumbs';

const BlogList: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;

  return (
    <>
      <Helmet>
        <title>{locale === 'he' ? 'בלוג ומדריכים | אחים שוואקי זכוכית' : 'Blog & Guides | Shwaki Brothers Glassworks'}</title>
        <meta name="description" content={locale === 'he' ? 'קראו את המדריכים המקצועיים שלנו בנושאי התקנת מקלחונים, זכוכית, מעקות וטרנדים בעיצוב הבית בגובה העיניים.' : 'Read our professional guides on glass installation, shower enclosures, railings, and home design trends.'} />
        <link rel="canonical" href={`https://www.shwakiglassworks.com/${locale}/blog`} />
      </Helmet>

      <AnimatedPageHeader>
        <div className="text-center max-w-3xl mx-auto">
          <BookOpen className="w-12 h-12 mx-auto text-brand-gold mb-4" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-brand-gold">
            {locale === 'he' ? 'בלוג ומדריכים מקצועיים' : 'Blog & Professional Guides'}
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            {locale === 'he' 
              ? 'כל מה שרציתם לדעת על עולם הזכוכית, מקלחונים, מעקות ועיצוב פנים'
              : 'Everything you wanted to know about glass, showers, railings, and interior design'
            }
          </p>
        </div>
      </AnimatedPageHeader>

      <div className="min-h-screen bg-gray-50/50 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <Breadcrumbs 
            items={[
              { label: locale === 'he' ? 'בלוג' : 'Blog' }
            ]}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {BLOG_POSTS.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group overflow-hidden"
              >
                {/* Visual placeholder header since we don't have dedicated blog images yet */}
                <div className="h-48 bg-gradient-to-br from-brand-navy to-brand-navy/80 flex items-center justify-center p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-black/20" />
                  <h3 className="text-2xl font-bold text-white relative z-10 text-center select-none" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {getLocalizedText(post.title, locale)}
                  </h3>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <span className="flex items-center gap-1.5 bg-brand-gold/10 text-brand-navy px-2.5 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString(locale === 'he' ? 'he-IL' : 'en-US')}
                    </span>
                    <span className="flex items-center gap-1.5 flex-1 justify-end">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-brand-navy mb-3 line-clamp-2 mix-blend-multiply group-hover:text-brand-gold transition-colors">
                    <Link to={`/${locale}/blog/${post.slug}`} className="focus:outline-none">
                      <span className="absolute inset-0 z-10" />
                      {getLocalizedText(post.title, locale)}
                    </Link>
                  </h2>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                    {getLocalizedText(post.excerpt, locale)}
                  </p>

                  <div className="flex items-center justify-between text-sm font-semibold text-brand-gold mt-auto pt-4 border-t border-gray-50 group-hover:text-brand-navy transition-colors">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-gray-600 font-medium">{post.author}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      {locale === 'he' ? 'קראו עוד' : 'Read More'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;
