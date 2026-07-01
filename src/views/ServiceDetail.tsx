'use client';
import React, { useMemo, useState } from 'react';
import { usePathname, useParams, redirect } from 'next/navigation';
import Link from 'next/link';;
;
import { CheckCircle, Phone, MessageCircle, ArrowLeft, ArrowRight, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  getServiceSeoPageByServiceId,
  getServiceSeoPageBySlug,
  SERVICE_SEO_SECTION_TITLES, 
  LOCATION_SEO_LINKS,
  LOCATION_SEO_ALIAS_PREFIX
} from '@/data/service-seo-content';
import { getLocalizedText, getLocalizedArray, CONTACT_INFO, UI_STRINGS, type SupportedLocale } from '@/data';
import { BLOG_POSTS } from '@/data/blog-posts';
import ServiceJsonLd from '@/components/ServiceJsonLd';
import { useCloudinaryImages, getThumbnailUrl, getGalleryUrl } from '@/hooks/cloudinary';
import ImagePreviewModal from '@/components/projects/ImagePreviewModal';
import type { CloudinaryImage } from '@/lib/cloudinary';

const ServiceDetail: React.FC = () => {
  const { lang, serviceId } = useParams<{ lang: string; serviceId: string }>();
  const location = { pathname: usePathname() };
  const { currentLanguage, isRTL } = useLanguage();
  const locale = (lang || currentLanguage) as SupportedLocale;

  const service = useMemo(() => {
    // First try by serviceId param (from /:lang/services/:serviceId route)
    if (serviceId) {
      return getServiceSeoPageByServiceId(serviceId);
    }
    // Fallback: extract slug from URL path (for SEO slug-based routes like /:lang/glass-shower-installation)
    const pathSegments = location.pathname.split('/');
    const slug = pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2];
    if (slug) {
      return getServiceSeoPageBySlug(slug);
    }
    return null;
  }, [serviceId, location.pathname]);

  if (!service) {
    redirect(`/${locale}/services`);
    return null;
  }

  const t = (obj: unknown) => getLocalizedText(obj as Record<SupportedLocale, string>, locale);
  const titles = SERVICE_SEO_SECTION_TITLES;

  // Fetch project photos from matching Cloudinary category
  const { images: projectImages, isLoading: imagesLoading } = useCloudinaryImages(service.cloudinaryCategory, { limit: 8 });
  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (img: CloudinaryImage, idx: number) => { setPreviewImage(img); setPreviewIndex(idx); };
  const handlePrev = () => { const i = previewIndex === 0 ? projectImages.length - 1 : previewIndex - 1; setPreviewIndex(i); setPreviewImage(projectImages[i]); };
  const handleNext = () => { const i = previewIndex === projectImages.length - 1 ? 0 : previewIndex + 1; setPreviewIndex(i); setPreviewImage(projectImages[i]); };

  const whatsappMessage = `שלום, אשמח לקבל הצעת מחיר עבור ${t(service.heroTitle)}`;

  const relatedPosts = useMemo(() => BLOG_POSTS.filter((p) => p.relatedServiceId === service.serviceId).slice(0, 4), [service.serviceId]);

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
            {projectImages.length > 0 && (
              <div className="mt-12 pt-10 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy flex items-center gap-2">
                    <Camera className="w-6 h-6 text-brand-gold" />
                    {t(titles.photos)}
                  </h2>
                  <Link
                    href={`/${locale}/projects?category=${service.projectCategoryId}`}
                    className="text-sm text-brand-gold hover:text-brand-navy font-medium transition-colors"
                  >
                    {locale === 'he' ? 'כל התמונות →' : locale === 'ar' ? 'جميع الصور →' : locale === 'ru' ? 'Все фото →' : 'All photos →'}
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {projectImages.map((img, idx) => (
                    <button
                      key={img.public_id}
                      onClick={() => openPreview(img, idx)}
                      className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                      <img
                        src={getThumbnailUrl(img.public_id, 400)}
                        alt={img.context?.custom?.alt || t(service.heroTitle)}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/30 transition-colors duration-300 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
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
                  return (
                    <Link 
                      key={slug}
                      href={`/${locale}/${LOCATION_SEO_ALIAS_PREFIX}-${slug}`}
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

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          images={projectImages}
          previewIndex={previewIndex}
          onClose={() => setPreviewImage(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          getImageCategory={() => t(service.heroTitle)}
        />
      )}
    </div>
  );
};

export default ServiceDetail;
