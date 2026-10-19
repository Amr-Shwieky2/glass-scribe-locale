'use client';
/**
 * Hero Image Manager - Simple 1 Image Selector
 * Easy admin interface to select the main hero image
 */
import { useState, useEffect, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  type CloudinaryImage,
  fetchAllImages,
  fetchHeroPositionImages,
  getThumbnailUrl,
} from '@/lib/cloudinary';
import { setHeroPosition, removeHeroPosition } from '@/lib/cloudinary/admin-api';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, ImageIcon, Trash2 } from 'lucide-react';


const BROKEN_IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='40'%3E%F0%9F%96%BC%3C/text%3E%3C/svg%3E";

interface HeroGalleryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Get hero position from image tags (hero-1)
const getHeroPosition = (image: CloudinaryImage): number | null => {
  const heroTag = image.tags?.find(tag => tag === 'hero-1');
  if (heroTag) return 1;
  return null;
};

const HeroGalleryManager: FC<HeroGalleryManagerProps> = ({ open, onOpenChange }) => {
  const { isAuthenticated } = useAdmin();
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);

  const [allImages, setAllImages] = useState<CloudinaryImage[]>([]);
  const [currentHeroImage, setCurrentHeroImage] = useState<CloudinaryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load all images
  useEffect(() => {
    if (!open) return;

    const loadImages = async () => {
      setIsLoading(true);
      try {
        const [allResponse, heroResponse] = await Promise.all([
          fetchAllImages(),
          fetchHeroPositionImages()
        ]);

        const allImgs = allResponse.resources || [];
        const heroImgs = heroResponse.resources || [];

        // Merge and deduplicate
        const imageMap = new Map<string, CloudinaryImage>();
        heroImgs.forEach(img => imageMap.set(img.public_id, img));
        allImgs.forEach(img => {
          if (!imageMap.has(img.public_id)) {
            imageMap.set(img.public_id, img);
          }
        });

        const images = Array.from(imageMap.values());
        setAllImages(images);

        // Find current hero image (hero-1 tag)
        const heroImage = images.find(img => getHeroPosition(img) === 1);
        setCurrentHeroImage(heroImage || null);
      } catch (error) {
        console.error('Failed to load images:', error);
        toast({ title: t(ADMIN_STRINGS.heroManager.errorLoadTitle), description: t(ADMIN_STRINGS.heroManager.errorLoadDesc), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Select a new hero image
  const handleSelectImage = async (image: CloudinaryImage) => {
    if (!isAuthenticated) return;

    setIsSaving(true);
    try {
      // Remove current hero image tag if exists
      if (currentHeroImage) {
        await removeHeroPosition(currentHeroImage.public_id, 1);
      }

      // Set new image as hero-1
      await setHeroPosition(image.public_id, 1);

      // Invalidate client cache so HeroSection picks up the change

      // Update local state
      setCurrentHeroImage(image);
      setAllImages(prev => prev.map(img => {
        if (img.public_id === image.public_id) {
          const newTags = (img.tags || []).filter(t => t !== 'hero-1');
          newTags.push('hero-1');
          return { ...img, tags: newTags };
        }
        if (img.public_id === currentHeroImage?.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== 'hero-1') };
        }
        return img;
      }));

      toast({ title: t(ADMIN_STRINGS.heroManager.successTitle), description: t(ADMIN_STRINGS.heroManager.successDesc) });
    } catch (error) {
      console.error('Failed to set hero image:', error);
      toast({ title: t(ADMIN_STRINGS.heroManager.errorUpdateTitle), description: t(ADMIN_STRINGS.heroManager.errorUpdateDesc), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Remove hero image
  const handleRemoveHero = async () => {
    if (!isAuthenticated || !currentHeroImage) return;

    setIsSaving(true);
    try {
      await removeHeroPosition(currentHeroImage.public_id, 1);

      // Invalidate client cache

      setAllImages(prev => prev.map(img => {
        if (img.public_id === currentHeroImage.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== 'hero-1') };
        }
        return img;
      }));

      setCurrentHeroImage(null);
      toast({ title: t(ADMIN_STRINGS.heroManager.removedTitle), description: t(ADMIN_STRINGS.heroManager.removedDesc) });
    } catch (error) {
      console.error('Failed to remove hero image:', error);
      toast({ title: t(ADMIN_STRINGS.heroManager.errorUpdateTitle), description: t(ADMIN_STRINGS.heroManager.errorUpdateDesc), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-navy flex items-center gap-3">
            <ImageIcon className="w-7 h-7 text-brand-gold" />
            <span>{t(ADMIN_STRINGS.heroManager.title)}</span>
            {currentHeroImage && (
              <span className="text-sm font-normal bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {t(ADMIN_STRINGS.heroManager.imageSelected)}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-gold" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-bold text-blue-800 text-lg mb-2">{t(ADMIN_STRINGS.heroManager.howToUseTitle)}</p>
              <p className="text-blue-700">{t(ADMIN_STRINGS.heroManager.howToUseBody)}</p>
            </div>

            {/* Current Hero Image Preview */}
            <div>
              <h3 className="text-lg font-bold text-brand-navy mb-3">
                {t(ADMIN_STRINGS.heroManager.currentImage)}
              </h3>
              {currentHeroImage ? (
                <div className="relative max-w-md mx-auto">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl border-4 border-brand-gold">
                    <img
                      src={getThumbnailUrl(currentHeroImage.public_id, 600)}
                      alt={t(ADMIN_STRINGS.heroManager.altText)}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = BROKEN_IMG_FALLBACK; }}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveHero}
                    disabled={isSaving}
                    className="absolute top-3 right-3 shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    {t(ADMIN_STRINGS.heroManager.remove)}
                  </Button>
                </div>
              ) : (
                <div className="max-w-md mx-auto aspect-[4/3] rounded-xl border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-gray-500 p-8">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">{t(ADMIN_STRINGS.heroManager.noImageSelected)}</p>
                    <p className="text-sm">{t(ADMIN_STRINGS.heroManager.selectFromGallery)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <div>
              <h3 className="text-lg font-bold text-brand-navy mb-3">
                {t(ADMIN_STRINGS.heroManager.galleryTitle)} ({allImages.length} {t(ADMIN_STRINGS.heroManager.imageCount)})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-2 bg-gray-50 rounded-xl">
                {allImages.map(image => {
                  const isCurrentHero = currentHeroImage?.public_id === image.public_id;

                  return (
                    <button
                      key={image.public_id}
                      onClick={() => !isCurrentHero && handleSelectImage(image)}
                      disabled={isSaving || isCurrentHero}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all shadow-md hover:shadow-xl ${
                        isCurrentHero
                          ? 'ring-4 ring-brand-gold scale-105 cursor-default'
                          : 'hover:scale-105 hover:ring-2 hover:ring-brand-gold/50 cursor-pointer'
                      } ${isSaving ? 'opacity-50' : ''}`}
                    >
                      <img
                        src={getThumbnailUrl(image.public_id, 300)}
                        alt={image.context?.custom?.alt || t(ADMIN_STRINGS.heroManager.altText)}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = BROKEN_IMG_FALLBACK; }}
                      />
                      {isCurrentHero && (
                        <div className="absolute inset-0 bg-brand-gold/30 flex items-center justify-center">
                          <div className="bg-brand-gold text-white rounded-full p-3 shadow-lg">
                            <Check className="w-8 h-8" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HeroGalleryManager;
