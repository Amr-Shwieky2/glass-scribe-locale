'use client';
import React, { useMemo } from 'react';
import { useParams, redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BLOG_POSTS, SERVICES, getLocalizedText, type SupportedLocale } from '@/data';
import Breadcrumbs from '@/components/Breadcrumbs';

// Ultra-lightweight markdown parser for safe, controlled blog strings
const MinimalMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const html = useMemo(() => {
    let parsed = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Headers
    parsed = parsed.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-brand-navy mt-10 mb-4">$1</h3>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-brand-navy mt-12 mb-6 border-b pb-2">$1</h2>');
    
    // Bold
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-brand-navy">$1</strong>');
    
    // Lists
    parsed = parsed.replace(/^\s*-\s(.*)$/gim, '<li class="ml-4 rtl:mr-4 mb-2 list-disc">$1</li>');
    parsed = parsed.replace(/^\s*\d\.\s(.*)$/gim, '<li class="ml-4 rtl:mr-4 mb-2 list-decimal">$1</li>');
    
    // Replace multiple newlines with paragraph breaks, then single newlines with <br>
    parsed = parsed.replace(/\n\n+/g, '</p><p class="mb-6 leading-relaxed text-gray-700 text-lg">');
    parsed = parsed.replace(/\n/g, '<br/>');
    
    // Wrap the whole thing in a paragraph (and fix any empty starting/ending p tags)
    parsed = `<p class="mb-6 leading-relaxed text-gray-700 text-lg">${parsed}</p>`;
    parsed = parsed.replace(/<p class="[^"]*"><\/p>/g, '');
    parsed = parsed.replace(/<br\/><\/li>/g, '</li>');
    
    return parsed;
  }, [content]);

  return (
    <div 
      className="prose prose-lg max-w-none prose-headings:text-brand-navy prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
};

const BlogPost: React.FC = () => {
  const { lang, slug } = useParams<{ lang: string; slug: string }>();
  const { currentLanguage } = useLanguage();
  const locale = (lang || currentLanguage) as SupportedLocale;

  const post = useMemo(() => BLOG_POSTS.find(p => p.slug === slug), [slug]);
  
  // Resolve related service for internal linking SEO loop
  const relatedService = useMemo(() => 
    post?.relatedServiceId ? SERVICES.find(s => s.id === post.relatedServiceId) : null
  , [post]);

  if (!post) {
    redirect(`/${locale}/blog`);
    return null;
  }

  const title = getLocalizedText(post.title, locale);
  const excerpt = getLocalizedText(post.excerpt, locale);
  const content = getLocalizedText(post.content, locale);
  const publishDate = new Date(post.date).toISOString();

  // Article JSON-LD Schema built natively for deep Google parsing
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.shwakiglassworks.com/${locale}/blog/${post.slug}`,
    },
    headline: title,
    description: excerpt,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://www.shwakiglassworks.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Shwaki Brothers Glassworks',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.shwakiglassworks.com/logo.png'
      }
    },
    datePublished: publishDate,
    dateModified: publishDate,
  };

  return (
    <>
      <title>{`${title} | ${{ he: 'הבלוג של אחים שוואקי', en: 'Shwaki Brothers Blog', ar: 'مدونة إخوة شواكي', ru: 'Блог Братьев Шваки' }[locale]}`}</title>
      <meta name="description" content={excerpt} />
      <link rel="canonical" href={`https://www.shwakiglassworks.com/${locale}/blog/${post.slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      {/* Modern hero spanning screen width */}
      <div className="bg-brand-navy text-white pt-24 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex items-center gap-2 text-brand-gold text-sm font-semibold mb-6 uppercase tracking-wider">
            <span>{post.category}</span>
            <span>•</span>
            <span className="text-white/80 flex items-center gap-1.5"><Clock className="w-4 h-4"/> {post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 drop-shadow-md">
            {title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-white/20 pt-6 mt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy font-bold text-lg shadow-inner">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-lg">{post.author}</p>
                <p className="text-sm text-white/70 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.date).toLocaleDateString(
                    { he: 'he-IL', en: 'en-US', ar: 'ar-SA', ru: 'ru-RU' }[locale] ?? 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white pb-20 pt-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Breadcrumbs 
              items={[
                { label: locale === 'he' ? 'בלוג' : 'Blog', href: `/${locale}/blog` },
                { label: title }
              ]}
            />
            
            <article className="mt-10 bg-white shadow-xl shadow-brand-navy/5 rounded-3xl p-8 md:p-12 border border-gray-100">
              <MinimalMarkdown content={content} />
            </article>

            {/* Internal Linking SEO Section */}
            {relatedService && (
               <div className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                 <div className="text-center sm:text-start">
                   <h3 className="text-xl font-bold text-brand-navy mb-2">
                     {{ he: 'צריכים עזרה עם פרויקט זכוכית?', en: 'Need help with a glass project?', ar: 'هل تحتاج مساعدة في مشروع زجاج؟', ru: 'Нужна помощь со стеклянным проектом?' }[locale]}
                   </h3>
                   <p className="text-gray-600">
                     {{ he: `המומחים שלנו כאן לשירותכם בנושא ${getLocalizedText(relatedService.title, locale)}.`, en: `Our experts are here to help you with ${getLocalizedText(relatedService.title, locale)}.`, ar: `خبراؤنا هنا لمساعدتك في ${getLocalizedText(relatedService.title, locale)}.`, ru: `Наши эксперты готовы помочь вам с ${getLocalizedText(relatedService.title, locale)}.` }[locale]}
                   </p>
                 </div>
                 <Link
                   href={`/${locale}/services`}
                   className="shrink-0 bg-brand-navy hover:bg-brand-navy/90 text-white font-medium px-8 py-3.5 rounded-full inline-flex items-center gap-2 transition-transform hover:scale-105 shadow-md"
                 >
                   {{ he: 'למסך השירותים', en: 'View Services', ar: 'عرض الخدمات', ru: 'Смотреть услуги' }[locale]}
                   <ArrowRight className="w-5 h-5 rtl:hidden" />
                   <ArrowLeft className="w-5 h-5 hidden rtl:block" />
                 </Link>
               </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
