/**
 * Service landing page (Server Component), e.g. /he/glass-shower-installation.
 * Project photos are fetched on the server (cached) and handed to a small client gallery.
 */
import React from 'react';
import Link from 'next/link';
import { CheckCircle, Phone, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  SERVICE_SEO_SECTION_TITLES,
  LOCATION_SEO_LINKS,
  type ServiceSeoPage,
} from '@/data/service-seo-content';
import { getLocalizedText, getLocalizedArray } from '@/data/helpers';
import { CONTACT_INFO } from '@/data/contact';
import { UI_STRINGS } from '@/data/ui-strings';
import type { SupportedLocale } from '@/data/types';
import { BLOG_POSTS } from '@/data/blog-posts';
import { hasLocationPage } from '@/data/locations';
import { isRTLLocale } from '@/lib/i18n';
import { getImagesByFolder } from '@/lib/cloudinary/server';
import ServiceJsonLd from '@/components/ServiceJsonLd';
import ServicePhotos from '@/components/services/ServicePhotos';
import AskAiLine from '@/components/chat/AskAiLine';
import { SERVICE_ASK_AI } from '@/data/chat';
import { SHOW_FAQ_SECTIONS } from '@/data/site-features';

interface ServiceDetailProps {
  locale: SupportedLocale;
  service: ServiceSeoPage;
}

const ServiceDetail = async ({ locale, service }: ServiceDetailProps) => {
  const isRTL = isRTLLocale(locale);
  const t = (obj: unknown) => getLocalizedText(obj as Record<SupportedLocale, string>, locale);
  const titles = SERVICE_SEO_SECTION_TITLES;

  // Project photos from the matching Cloudinary folder (server-side, cached 1h)
  const projectImages = await getImagesByFolder(service.cloudinaryCategory, 8);

  const whatsappMessage = `שלום, אשמח לקבל הצעת מחיר עבור ${t(service.heroTitle)}`;

  const relatedPosts = BLOG_POSTS.filter((p) => p.relatedServiceId === service.serviceId).slice(0, 4);

  return (
    <div className="min-h-screen bg-brand-light">

      <ServiceJsonLd service={service} locale={locale} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-brand-navy text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Link 
            href={`/${locale}/services`}
            className="inline-flex items-center text-brand-gold hover:text-white transition-colors mb-6 text-sm font-medium"
          >
            {isRTL ? <ArrowRight className="ml-2 w-4 h-4" /> : <ArrowLeft className="mr-2 w-4 h-4" />}
            {locale === 'he' ? 'כל השירותים' : locale === 'ar' ? 'جميع الخدمات' : locale === 'ru' ? 'Все услуги' : 'All Services'}
          </Link>
          <p className="text-brand-gold font-medium mb-4">{t(service.eyebrow)}</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{t(service.heroTitle)}</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t(service.heroSubtitle)}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left / Right Column: Typography & Text */}
          <div className="lg:col-span-2 space-y-12">
            <div className="prose prose-lg max-w-none text-brand-navy">
              <p className="text-xl leading-relaxed text-brand-navy/90 font-medium mb-8">
                {t(service.intro)}
              </p>
              
              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.overview)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.overview)}</p>

              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.options)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.options)}</p>

              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.process)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.process)}</p>

              <h2 className="text-2xl font-bold text-brand-navy mt-10 mb-4">{t(titles.benefits)}</h2>
              <p className="leading-relaxed text-gray-700">{t(service.benefits)}</p>
            </div>

            {/* Project Photos Gallery */}
            <ServicePhotos
              images={projectImages}
              title={t(titles.photos)}
              altFallback={t(service.heroTitle)}
              allPhotosHref={`/${locale}/projects?category=${service.projectCategoryId}`}
              allPhotosLabel={locale === 'he' ? 'כל התמונות →' : locale === 'ar' ? 'جميع الصور →' : locale === 'ru' ? 'Все фото →' : 'All photos →'}
            />

            {/* FAQs — while SHOW_FAQ_SECTIONS is off, one line opens the AI chat instead (it knows these answers) */}
            {SHOW_FAQ_SECTIONS ? (
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h2 className="text-3xl font-bold text-brand-navy mb-8">{t(titles.faq)}</h2>
                <div className="space-y-6">
                  {service.faqs.map((faq: { question: unknown, answer: unknown }, idx: number) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-bold text-brand-navy mb-3">{t(faq.question)}</h3>
                      <p className="text-gray-700 leading-relaxed">{t(faq.answer)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <AskAiLine
                  question={t(SERVICE_ASK_AI.question).replace('{service}', t(service.heroTitle))}
                  cta={t(SERVICE_ASK_AI.cta)}
                  draft={t(SERVICE_ASK_AI.draft).replace('{service}', t(service.heroTitle))}
                />
              </div>
            )}

            {/* Related Articles - SEO Internal Linking */}
            {relatedPosts.length > 0 && (
              <div className="mt-16 pt-12 border-t border-gray-200">
                <h2 className="text-3xl font-bold text-brand-navy mb-8 flex items-center gap-2">
                  <MessageCircle className="w-7 h-7 text-brand-gold" />
                  {locale === 'he' ? 'מאמרים קשורים בבלוג' : locale === 'ar' ? 'مقالات ذات صلة' : locale === 'ru' ? 'Похожие статьи' : 'Related Articles'}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {relatedPosts.map(post => (
                    <Link key={post.id} href={`/${locale}/blog/${post.slug}`} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:bg-brand-navy hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md">
                      <h3 className="font-bold text-lg mb-3 group-hover:text-brand-gold transition-colors">{getLocalizedText(post.title, locale)}</h3>
                      <p className="text-sm opacity-80 line-clamp-3 leading-relaxed group-hover:opacity-100 transition-opacity">{getLocalizedText(post.excerpt, locale)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar (Contact / Navigation) */}
          <div className="space-y-8">
            {/* CTA Box */}
            <div className="bg-brand-navy text-white p-8 rounded-2xl shadow-xl sticky top-24">
              <h3 className="text-2xl font-bold mb-4 text-brand-gold">{t(UI_STRINGS.ctaReadyToStart)}</h3>
              <p className="text-white/80 mb-8">{t(UI_STRINGS.ctaContactToday)}</p>
              
              <div className="space-y-4">
                <a 
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-gold text-brand-navy py-4 px-6 rounded-xl font-bold hover:bg-white transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  {t(UI_STRINGS.whatsapp)}
                </a>
                <a 
                  href={`tel:${CONTACT_INFO.phoneIntl}`}
                  className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-4 px-6 rounded-xl font-bold hover:bg-white/20 border border-white/20 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {CONTACT_INFO.phone}
                </a>
              </div>
            </div>

            {/* Highlights */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-brand-navy mb-4 border-b pb-2">{t(titles.highlights)}</h3>
              <ul className="space-y-3">
                {getLocalizedArray(service.highlights, locale).map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-brand-navy mb-4 border-b pb-2">{t(titles.areas)}</h3>
              <p className="text-sm text-gray-600 mb-4">{t(service.areasSummary)}</p>
              <div className="flex flex-wrap gap-2">
                {service.relatedLocations.map((slug: string) => {
                  const loc = LOCATION_SEO_LINKS.find(l => l.slug === slug);
                  if (!loc) return null;
                  if (!hasLocationPage(slug)) {
                    return (
                      <span key={slug} className="text-xs bg-gray-50 text-brand-navy border border-gray-200 px-3 py-1.5 rounded-full">
                        {t(loc.label)}
                      </span>
                    );
                  }
                  return (
                    <Link 
                      key={slug}
                      href={`/${locale}/${slug}`}
                      className="text-xs bg-gray-50 hover:bg-brand-navy hover:text-white text-brand-navy border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {t(loc.label)}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetail;
