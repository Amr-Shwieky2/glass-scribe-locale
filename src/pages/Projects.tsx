import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectGridItem from '@/components/projects/ProjectGridItem';
import ProjectListItem from '@/components/projects/ProjectListItem';
import ImagePreviewModal from '@/components/projects/ImagePreviewModal';
import ProjectsCTA from '@/components/projects/ProjectsCTA';
import { useCloudinaryImages } from '@/hooks/cloudinary';
import { getCategoryFromPublicId, type CloudinaryImage } from '@/lib/cloudinary';
import { CONTACT_INFO, PAGE_CONTENT, UI_STRINGS, getLocalizedText, PROJECT_CATEGORIES, type SupportedLocale } from '@/data';

const Projects: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.projects;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(searchParams.get('category') || undefined);
  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const cloudinaryFolder = useMemo(() => {
    if (!selectedCategory) return undefined;
    return PROJECT_CATEGORIES.find(c => c.id === selectedCategory)?.cloudinaryFolder;
  }, [selectedCategory]);

  const { images, isLoading } = useCloudinaryImages(cloudinaryFolder, { limit: 50 });

  const handleCategoryChange = (cat: string | undefined) => { setSelectedCategory(cat); cat ? setSearchParams({ category: cat }) : setSearchParams({}); };
  useEffect(() => { const c = searchParams.get('category') || undefined; if (c !== selectedCategory) setSelectedCategory(c); }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <section className="py-8 sm:py-10 md:py-12 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold" /></div>
          ) : images.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6' : 'space-y-4 sm:space-y-6'}>
              {images.map((img, idx) => {
                const props = { key: img.public_id, img, categoryLabel: getImageCategory(img), featured: img.tags?.includes('featured') ?? false, altText: img.context?.custom?.alt || getImageCategory(img) || 'Glass work', locale, onClick: () => openPreview(img, idx) };
                return viewMode === 'list' ? <ProjectListItem {...props} /> : <ProjectGridItem {...props} />;
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
