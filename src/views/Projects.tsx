'use client';
/**
 * Projects gallery (client island). Images are fetched on the server (cached)
 * and passed in; filtering by category happens locally. The category is read
 * from the URL after mount instead of via useSearchParams, so the whole page
 * (including the <h1>) is server-rendered rather than bailing out to the client.
 */
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectGridItem from '@/components/projects/ProjectGridItem';
import ProjectListItem from '@/components/projects/ProjectListItem';
import ImagePreviewModal from '@/components/projects/ImagePreviewModal';
import ProjectsCTA from '@/components/projects/ProjectsCTA';
import { getCategoryFromPublicId, type CloudinaryImage } from '@/lib/cloudinary';
import { CONTACT_INFO } from '@/data/contact';
import { PAGE_CONTENT } from '@/data/page-content';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import { PROJECT_CATEGORIES } from '@/data/project-categories';
import type { SupportedLocale } from '@/data/types';
import { useRouter } from 'next/navigation';

interface ProjectsProps {
  locale: SupportedLocale;
  /** All gallery images, newest first (server-fetched). */
  images: CloudinaryImage[];
  /** project category id → service landing page href (resolved on the server). */
  serviceHrefByCategory: Record<string, string>;
}

const isKnownCategory = (id: string | null): id is string => !!id && PROJECT_CATEGORIES.some((c) => c.id === id);

const Projects: React.FC<ProjectsProps> = ({ locale, images: allImages, serviceHrefByCategory }) => {
  const content = PAGE_CONTENT.projects;
  const router = useRouter();

  const setSearchParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(window.location.search);
    if (Object.keys(params).length === 0) {
      newParams.delete('category');
    } else {
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      });
    }
    const qs = newParams.toString();
    router.replace(qs ? `?${qs}` : window.location.pathname, { scroll: false });
  };

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const cloudinaryFolder = useMemo(() => {
    if (!selectedCategory) return undefined;
    return PROJECT_CATEGORIES.find(c => c.id === selectedCategory)?.cloudinaryFolder;
  }, [selectedCategory]);

  const images = useMemo(
    () => (cloudinaryFolder ? allImages.filter((img) => img.public_id.includes(`/${cloudinaryFolder}/`)) : allImages),
    [allImages, cloudinaryFolder]
  );

  const handleCategoryChange = (cat: string | undefined) => { setSelectedCategory(cat); if (cat) { setSearchParams({ category: cat }) } else { setSearchParams({}) } };

  // Apply ?category= from the URL after hydration (and on back/forward)
  useEffect(() => {
    const sync = () => {
      const c = new URLSearchParams(window.location.search).get('category');
      setSelectedCategory(isKnownCategory(c) ? c : undefined);
    };
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  // Find matching SEO service page for selected category (for subtle "learn more" link)
  const serviceDetailHref = selectedCategory ? serviceHrefByCategory[selectedCategory] ?? null : null;

  const getImageCategory = (img: CloudinaryImage) => {
    const cldCat = getCategoryFromPublicId(img.public_id);
    if (!cldCat) return '';
    const match = PROJECT_CATEGORIES.find(c => c.cloudinaryFolder === cldCat);
    return match ? getLocalizedText(match.name, locale) : cldCat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleWhatsApp = () => window.open(`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(getLocalizedText(UI_STRINGS.whatsappProjectInquiry, locale))}`, '_blank');
  const handlePrev = () => { const i = previewIndex === 0 ? images.length - 1 : previewIndex - 1; setPreviewIndex(i); setPreviewImage(images[i]); };
  const handleNext = () => { const i = previewIndex === images.length - 1 ? 0 : previewIndex + 1; setPreviewIndex(i); setPreviewImage(images[i]); };
  const openPreview = (img: CloudinaryImage, idx: number) => { setPreviewImage(img); setPreviewIndex(idx); };

  return (
    <div className="min-h-screen">
      <ProjectsHeader locale={locale} title={content.title} subtitle={content.subtitle} imageCount={images.length} />
      <ProjectFilters selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} viewMode={viewMode} onViewModeChange={setViewMode} locale={locale} allCategoriesText={content.allCategories} />
      
      {/* Subtle link to service detail page when a category is selected */}
      {serviceDetailHref && selectedCategory && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 sm:px-6 py-2">
            <Link
              href={serviceDetailHref}
              className="text-xs text-brand-navy/50 hover:text-brand-gold transition-colors"
            >
              {locale === 'he' ? 'קרא עוד על שירות זה →' : locale === 'ar' ? 'اقرأ المزيد عن هذه الخدمة →' : locale === 'ru' ? 'Подробнее об этой услуге →' : 'Learn more about this service →'}
            </Link>
          </div>
        </div>
      )}

      <section className="py-8 sm:py-10 md:py-12 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          {images.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6' : 'space-y-4 sm:space-y-6'}>
              {images.map((img, idx) => {
                const props = { img, categoryLabel: getImageCategory(img), featured: img.tags?.includes('featured') ?? false, altText: img.context?.custom?.alt || getImageCategory(img) || 'Glass work', locale, onClick: () => openPreview(img, idx) };
                return viewMode === 'list' ? <ProjectListItem key={img.public_id} {...props} /> : <ProjectGridItem key={img.public_id} {...props} />;
              })}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6">📷</div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-navy mb-3 sm:mb-4">{getLocalizedText(content.noProjects, locale)}</h3>
              <p className="text-brand-navy/70 text-sm sm:text-base mb-6 sm:mb-8">{getLocalizedText(UI_STRINGS.projectComingSoon, locale)}</p>
              <button onClick={handleWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />{getLocalizedText(UI_STRINGS.whatsapp, locale)}
              </button>
            </div>
          )}
        </div>
      </section>
      {previewImage && <ImagePreviewModal image={previewImage} images={images} previewIndex={previewIndex} onClose={() => setPreviewImage(null)} onPrev={handlePrev} onNext={handleNext} getImageCategory={getImageCategory} />}
      <ProjectsCTA locale={locale} onWhatsApp={handleWhatsApp} />
    </div>
  );
};

export default Projects;
