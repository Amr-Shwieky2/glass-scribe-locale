/**
 * Projects Page - Static Version
 * 
 * Displays projects gallery with filtering.
 * All data is static - no backend required.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Grid, List, X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import { useCloudinaryImages, getGalleryUrl, getThumbnailUrl } from '@/hooks/useCloudinaryImages';
import { getCategoryFromPublicId, type CloudinaryImage } from '@/lib/cloudinary';
import {
  CONTACT_INFO,
  PAGE_CONTENT,
  UI_STRINGS,
  getLocalizedText,
  type SupportedLocale,
} from '@/data/business';

// =============================================================================
// PROJECT CATEGORIES (for navigation + labels)
// =============================================================================

interface ProjectCategory {
  id: string;
  cloudinaryFolder: string;
  name: { en: string; he: string; ar: string; ru: string };
  slug: string;
  icon: string;
}

// Categories with mapping to Cloudinary folder names
const PROJECT_CATEGORIES: ProjectCategory[] = [
  { id: 'shower-glass', cloudinaryFolder: 'shower-enclosures', name: { en: 'Shower Glass', he: 'מקלחונים', ar: 'زجاج الدش', ru: 'Душевое стекло' }, slug: 'shower-glass', icon: '🚿' },
  { id: 'glass-railings', cloudinaryFolder: 'glass-railings', name: { en: 'Glass Railings', he: 'מעקות זכוכית', ar: 'درابزين زجاجي', ru: 'Стеклянные ограждения' }, slug: 'glass-railings', icon: '🏠' },
  { id: 'mirrors', cloudinaryFolder: 'mirrors', name: { en: 'Mirrors', he: 'מראות', ar: 'مرايا', ru: 'Зеркала' }, slug: 'mirrors', icon: '🪞' },
  { id: 'glass-partitions', cloudinaryFolder: 'partitions', name: { en: 'Glass Partitions', he: 'מחיצות זכוכית', ar: 'فواصل زجاجية', ru: 'Стеклянные перегородки' }, slug: 'glass-partitions', icon: '🏢' },
  { id: 'storefront', cloudinaryFolder: 'storefronts', name: { en: 'Storefront Glass', he: 'חזיתות חנויות', ar: 'واجهات المتاجر', ru: 'Витринное стекло' }, slug: 'storefront', icon: '🏪' },
  { id: 'glass-doors', cloudinaryFolder: 'glass-doors', name: { en: 'Glass Doors', he: 'דלתות זכוכית', ar: 'أبواب زجاجية', ru: 'Стеклянные двери' }, slug: 'glass-doors', icon: '🚪' },
  { id: 'backsplashes', cloudinaryFolder: 'backsplashes', name: { en: 'Backsplashes', he: 'חיפויי קיר', ar: 'واجهات خلفية', ru: 'Стеклянные фартуки' }, slug: 'backsplashes', icon: '✨' },
  { id: 'shelves', cloudinaryFolder: 'shelves', name: { en: 'Glass Shelves', he: 'מדפי זכוכית', ar: 'أرفف زجاجية', ru: 'Стеклянные полки' }, slug: 'shelves', icon: '📐' },
  { id: 'lobbies', cloudinaryFolder: 'lobbies', name: { en: 'Lobby Glass', he: 'זכוכית לובי', ar: 'زجاج اللوبي', ru: 'Стекло для лобби' }, slug: 'lobbies', icon: '🏛️' },
];

// =============================================================================
// COMPONENT
// =============================================================================

const Projects: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const content = PAGE_CONTENT.projects;
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial category from URL
  const initialCategory = searchParams.get('category') || undefined;
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [previewImage, setPreviewImage] = useState<CloudinaryImage | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Resolve Cloudinary folder from selected category
  const cloudinaryFolder = useMemo(() => {
    if (!selectedCategory) return undefined;
    const cat = PROJECT_CATEGORIES.find(c => c.id === selectedCategory);
    return cat?.cloudinaryFolder;
  }, [selectedCategory]);

  // Fetch images from Cloudinary
  const { images, isLoading } = useCloudinaryImages(
    cloudinaryFolder,
    { limit: 50 }
  );

  // Update URL when category changes
  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // Sync with URL on mount/change
  useEffect(() => {
    const urlCategory = searchParams.get('category') || undefined;
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Get category display info for a Cloudinary image (localized)
  const getImageCategory = (img: CloudinaryImage) => {
    const cldCat = getCategoryFromPublicId(img.public_id);
    if (!cldCat) return '';
    // Find matching PROJECT_CATEGORY by cloudinaryFolder and return localized name
    const match = PROJECT_CATEGORIES.find(c => c.cloudinaryFolder === cldCat);
    if (match) return getLocalizedText(match.name, locale);
    // Fallback: capitalize the folder name
    return cldCat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Get human-friendly label for a category ID
  const getCategoryName = (categoryId: string) => {
    const category = PROJECT_CATEGORIES.find(c => c.id === categoryId);
    return category ? getLocalizedText(category.name, locale) : '';
  };

  // Check if image is featured
  const isFeatured = (img: CloudinaryImage) => img.tags?.includes('featured');

  const handleWhatsApp = () => {
    const phone = CONTACT_INFO.whatsapp;
    const message = encodeURIComponent('Hello, I would like to inquire about a project');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  // Navigate preview
  const handlePrevImage = () => {
    setPreviewIndex(i => (i === 0 ? images.length - 1 : i - 1));
    setPreviewImage(images[previewIndex === 0 ? images.length - 1 : previewIndex - 1]);
  };
  const handleNextImage = () => {
    setPreviewIndex(i => (i === images.length - 1 ? 0 : i + 1));
    setPreviewImage(images[previewIndex === images.length - 1 ? 0 : previewIndex + 1]);
  };

  return (
    <div className="min-h-screen">
      {/* Animated Hero Section */}
      <AnimatedPageHeader>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-brand-gold">
            {getLocalizedText(content.title, locale)}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            {getLocalizedText(content.subtitle, locale)}
          </p>
          {/* Project Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mt-6">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-gold">{images.length || '—'}</p>
              <p className="text-sm text-gray-400">{getLocalizedText(UI_STRINGS.projectPhotos, locale)}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-gold">{PROJECT_CATEGORIES.length}</p>
              <p className="text-sm text-gray-400">{getLocalizedText(UI_STRINGS.projectCategories, locale)}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-brand-gold">100%</p>
              <p className="text-sm text-gray-400">{getLocalizedText(UI_STRINGS.projectSatisfaction, locale)}</p>
            </div>
          </div>
        </div>
      </AnimatedPageHeader>

      {/* Filters & Controls */}
      <section className="py-4 sm:py-6 md:py-8 bg-white border-b sticky top-16 sm:top-20 z-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(undefined)}
                className="rounded-full text-xs sm:text-sm px-3 sm:px-4 flex-shrink-0"
                size="sm"
              >
                {getLocalizedText(content.allCategories, locale)}
              </Button>
              {PROJECT_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => handleCategoryChange(category.id)}
                  className="rounded-full text-xs sm:text-sm px-3 sm:px-4 flex-shrink-0"
                  size="sm"
                >
                  <span className="mr-1">{category.icon}</span>
                  {getLocalizedText(category.name, locale)}
                </Button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-2 border rounded-full p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-full px-3"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-full px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-8 sm:py-10 md:py-12 bg-brand-light">
        <div className="container mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : images.length > 0 ? (
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6'
                : 'space-y-4 sm:space-y-6'
            }>
              {images.map((img, idx) => {
                const categoryLabel = getImageCategory(img);
                const featured = isFeatured(img);
                const altText = img.context?.custom?.alt || categoryLabel || 'Glass work';

                if (viewMode === 'list') {
                  return (
                    <div
                      key={img.public_id}
                      className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => {
                        setPreviewImage(img);
                        setPreviewIndex(idx);
                      }}
                    >
                      <div className="md:w-1/3 aspect-video md:aspect-auto relative overflow-hidden">
                        <img
                          src={getThumbnailUrl(img.public_id, 600)}
                          alt={altText}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        {featured && (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded-full">
                            ⭐ {getLocalizedText(UI_STRINGS.projectFeatured, locale)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 p-4 sm:p-6">
                        {categoryLabel && (
                          <span className="inline-block px-2 sm:px-3 py-1 bg-brand-gold/20 text-brand-navy rounded-full text-xs font-medium mb-2 sm:mb-3">
                            {categoryLabel}
                          </span>
                        )}
                        <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">
                          {img.context?.custom?.caption || altText}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(img.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">
                            {img.width}×{img.height} • {img.format?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Grid View
                return (
                  <div
                    key={img.public_id}
                    className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg aspect-[4/3] cursor-pointer"
                    onClick={() => {
                      setPreviewImage(img);
                      setPreviewIndex(idx);
                    }}
                  >
                    <img
                      src={getThumbnailUrl(img.public_id, 600)}
                      alt={altText}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured Badge */}
                    {featured && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-brand-gold text-brand-navy text-xs font-bold rounded-full">
                        ⭐ {getLocalizedText(UI_STRINGS.projectFeatured, locale)}
                      </span>
                    )}

                    {/* Hover info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {categoryLabel && (
                        <span className="inline-block px-2 py-0.5 bg-brand-gold/80 text-brand-navy rounded-full text-xs font-medium mb-1">
                          {categoryLabel}
                        </span>
                      )}
                      <p className="text-sm font-medium truncate">
                        {img.context?.custom?.caption || altText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6">📷</div>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-navy mb-3 sm:mb-4">
                {getLocalizedText(content.noProjects, locale)}
              </h3>
              <p className="text-brand-navy/70 text-sm sm:text-base mb-6 sm:mb-8">
                {getLocalizedText(UI_STRINGS.projectComingSoon, locale)}
              </p>
              <button onClick={handleWhatsApp} className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg">
                <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                {getLocalizedText(UI_STRINGS.whatsapp, locale)}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Full-screen Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
          {/* Header */}
          <div className="p-3 sm:p-4 flex justify-between items-center text-white safe-top">
            <div className="flex-1 mr-4">
              <h3 className="text-base sm:text-lg md:text-xl font-bold truncate">
                {previewImage.context?.custom?.caption || getImageCategory(previewImage) || 'Glass Work'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                {previewImage.width}×{previewImage.height} • {previewImage.format?.toUpperCase()} • {new Date(previewImage.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setPreviewImage(null)}
              className="p-2 hover:bg-white/10 rounded-full flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center px-2 sm:px-4 relative">
            <img
              src={getGalleryUrl(previewImage.public_id)}
              alt={previewImage.context?.custom?.alt || 'Preview'}
              className="max-h-[70vh] max-w-full object-contain rounded-lg"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 sm:left-4 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>

          {/* Counter */}
          <p className="text-white/60 text-center text-sm sm:text-base pb-4">
            {previewIndex + 1} / {images.length}
          </p>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-brand-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {getLocalizedText(UI_STRINGS.ctaHaveProject, locale)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/80">
            {getLocalizedText(UI_STRINGS.ctaNoObligation, locale)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={handleWhatsApp}
              className="btn-animated-gold-filled inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {getLocalizedText(UI_STRINGS.whatsapp, locale)}
            </button>
            <a
              href={`tel:${CONTACT_INFO.phoneIntl}`}
              className="btn-animated-gold inline-flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg"
            >
              <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {CONTACT_INFO.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
