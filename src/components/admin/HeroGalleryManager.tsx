/**
 * Hero Image Manager - Simple 1 Image Selector
 * Easy admin interface to select the main hero image
 */
import { useState, useEffect, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import {
  type CloudinaryImage,
  fetchAllImages,
  fetchHeroPositionImages,
  getThumbnailUrl,
} from '@/lib/cloudinary';
import { setHeroPosition, removeHeroPosition } from '@/lib/cloudinary/admin-api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, ImageIcon, Trash2 } from 'lucide-react';

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
  const { token } = useAdmin();
  const { toast } = useToast();
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
        toast({ title: 'שגיאה', description: 'נכשל בטעינת תמונות', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [open, toast]);

  // Select a new hero image
  const handleSelectImage = async (image: CloudinaryImage) => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      // Remove current hero image tag if exists
      if (currentHeroImage) {
        await removeHeroPosition(currentHeroImage.public_id, 1, token);
      }
      
      // Set new image as hero-1
      await setHeroPosition(image.public_id, 1, token);
      
      // Update state
      setCurrentHeroImage(image);
      
      // Update tags in allImages
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
      
      toast({ title: '✅ נשמר!', description: 'תמונת הראשי עודכנה בהצלחה' });
    } catch (error) {
      console.error('Failed to set hero image:', error);
      toast({ title: 'שגיאה', description: 'נכשל בעדכון תמונה', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Remove hero image
  const handleRemoveHero = async () => {
    if (!token || !currentHeroImage) return;
    
    setIsSaving(true);
    try {
      await removeHeroPosition(currentHeroImage.public_id, 1, token);
      
      setAllImages(prev => prev.map(img => {
        if (img.public_id === currentHeroImage.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== 'hero-1') };
        }
        return img;
      }));
      
      setCurrentHeroImage(null);
      toast({ title: '🗑️ הוסר', description: 'תמונת הראשי הוסרה' });
    } catch (error) {
      console.error('Failed to remove hero image:', error);
      toast({ title: 'שגיאה', description: 'נכשל בהסרת תמונה', variant: 'destructive' });
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
            <span>תמונת ראשי</span>
            {currentHeroImage && (
              <span className="text-sm font-normal bg-green-100 text-green-700 px-3 py-1 rounded-full">
                ✓ תמונה נבחרה
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
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-right" dir="rtl">
              <p className="font-bold text-blue-800 text-lg mb-2">📋 איך להשתמש:</p>
              <p className="text-blue-700">לחץ על תמונה כדי לבחור אותה כתמונה הראשית שתופיע בדף הבית</p>
            </div>

            {/* Current Hero Image Preview */}
            <div>
              <h3 className="text-lg font-bold text-brand-navy mb-3 text-right" dir="rtl">
                🖼️ תמונה נוכחית
              </h3>
              {currentHeroImage ? (
                <div className="relative max-w-md mx-auto">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl border-4 border-brand-gold">
                    <img
                      src={getThumbnailUrl(currentHeroImage.public_id, 600)}
                      alt="Hero"
                      className="w-full h-full object-cover"
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
                    הסר
                  </Button>
                </div>
              ) : (
                <div className="max-w-md mx-auto aspect-[4/3] rounded-xl border-4 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                  <div className="text-center text-gray-500 p-8">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">אין תמונה נבחרת</p>
                    <p className="text-sm">בחר תמונה מהגלריה למטה</p>
                  </div>
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <div>
              <h3 className="text-lg font-bold text-brand-navy mb-3 text-right" dir="rtl">
                🖼️ בחר תמונה ({allImages.length} תמונות)
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
                        alt={image.context?.custom?.alt || 'תמונה'}
                        className="w-full h-full object-cover"
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
