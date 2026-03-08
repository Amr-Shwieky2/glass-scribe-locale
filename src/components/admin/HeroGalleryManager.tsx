/**
 * Hero Gallery Manager
 * Allows admin to select and order the 7 hero images
 */
import { useState, useEffect, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import {
  type CloudinaryImage,
  fetchAllImages,
  getThumbnailUrl,
} from '@/lib/cloudinary';
import { setHeroPosition, removeHeroPosition } from '@/lib/cloudinary/admin-api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HeroGalleryManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Get hero position from image tags (hero-1, hero-2, etc.)
const getHeroPosition = (image: CloudinaryImage): number | null => {
  const heroTag = image.tags?.find(tag => /^hero-[1-7]$/.test(tag));
  if (heroTag) {
    return parseInt(heroTag.split('-')[1], 10);
  }
  return null;
};

const HeroGalleryManager: FC<HeroGalleryManagerProps> = ({ open, onOpenChange }) => {
  const { token } = useAdmin();
  const { toast } = useToast();
  const [allImages, setAllImages] = useState<CloudinaryImage[]>([]);
  const [heroSlots, setHeroSlots] = useState<(CloudinaryImage | null)[]>(Array(7).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load all images and organize hero slots
  useEffect(() => {
    if (!open) return;
    
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllImages();
        const images = response.resources || [];
        setAllImages(images);

        // Organize images into hero slots
        const slots: (CloudinaryImage | null)[] = Array(7).fill(null);
        images.forEach(img => {
          const pos = getHeroPosition(img);
          if (pos && pos >= 1 && pos <= 7) {
            slots[pos - 1] = img;
          }
        });
        setHeroSlots(slots);
      } catch (error) {
        console.error('Failed to load images:', error);
        toast({ title: 'Error', description: 'Failed to load images', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [open, toast]);

  const handleSelectImage = async (image: CloudinaryImage) => {
    if (selectedSlot === null || !token) return;
    
    setIsSaving(true);
    try {
      // Remove the image from any existing hero position
      const existingPos = getHeroPosition(image);
      if (existingPos) {
        await removeHeroPosition(image.public_id, existingPos, token);
      }

      // Remove current image from this slot if any
      const currentImage = heroSlots[selectedSlot];
      if (currentImage) {
        await removeHeroPosition(currentImage.public_id, selectedSlot + 1, token);
      }

      // Set new image to this position
      await setHeroPosition(image.public_id, selectedSlot + 1, token);

      // Update local state
      const newSlots = [...heroSlots];
      // Clear the old position if image was moved from another slot
      if (existingPos) {
        newSlots[existingPos - 1] = null;
      }
      newSlots[selectedSlot] = image;
      setHeroSlots(newSlots);

      // Update image tags in allImages
      setAllImages(prev => prev.map(img => {
        if (img.public_id === image.public_id) {
          const newTags = (img.tags || []).filter(t => !/^hero-[1-7]$/.test(t));
          newTags.push(`hero-${selectedSlot + 1}`);
          return { ...img, tags: newTags };
        }
        if (img.public_id === currentImage?.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== `hero-${selectedSlot + 1}`) };
        }
        return img;
      }));

      toast({ title: 'Success', description: `Image set to Hero position ${selectedSlot + 1}` });
      setSelectedSlot(null);
    } catch (error) {
      console.error('Failed to set hero position:', error);
      toast({ title: 'Error', description: 'Failed to update hero position', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromSlot = async (slotIndex: number) => {
    if (!token) return;
    const image = heroSlots[slotIndex];
    if (!image) return;

    setIsSaving(true);
    try {
      await removeHeroPosition(image.public_id, slotIndex + 1, token);

      const newSlots = [...heroSlots];
      newSlots[slotIndex] = null;
      setHeroSlots(newSlots);

      setAllImages(prev => prev.map(img => {
        if (img.public_id === image.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== `hero-${slotIndex + 1}`) };
        }
        return img;
      }));

      toast({ title: 'Removed', description: `Image removed from Hero position ${slotIndex + 1}` });
    } catch (error) {
      console.error('Failed to remove hero position:', error);
      toast({ title: 'Error', description: 'Failed to remove from position', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter images that are not already in hero slots (for selection)
  const availableImages = allImages.filter(img => {
    const pos = getHeroPosition(img);
    return !pos || pos === (selectedSlot !== null ? selectedSlot + 1 : 0);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-navy">
            🏠 Manage Hero Gallery (7 Images)
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-gold" />
          </div>
        ) : selectedSlot !== null ? (
          /* Image Selection View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-navy">
                Select image for Position {selectedSlot + 1}
              </h3>
              <Button variant="outline" onClick={() => setSelectedSlot(null)}>
                ← Back
              </Button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto">
              {availableImages.map(image => (
                <button
                  key={image.public_id}
                  onClick={() => handleSelectImage(image)}
                  disabled={isSaving}
                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-gold transition-all disabled:opacity-50"
                >
                  <img
                    src={getThumbnailUrl(image.public_id, 200)}
                    alt={image.context?.custom?.alt || 'Image'}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Hero Slots Grid View */
          <div className="space-y-4">
            <p className="text-sm text-brand-navy/70">
              Click on a slot to select an image for that position. These 7 images will appear in the hero section on the home page.
            </p>
            <div className="grid grid-cols-4 gap-4">
              {/* Main large image - position 1 */}
              <Card className="col-span-2 row-span-2 border-2 border-dashed border-brand-gold/50">
                <CardHeader className="py-2 px-3">
                  <CardTitle className="text-sm font-medium text-brand-gold">Position 1 (Main)</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  {heroSlots[0] ? (
                    <div className="relative aspect-square rounded-lg overflow-hidden group">
                      <img
                        src={getThumbnailUrl(heroSlots[0].public_id, 400)}
                        alt="Hero 1"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" onClick={() => setSelectedSlot(0)}>Change</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemoveFromSlot(0)}>Remove</Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedSlot(0)}
                      className="w-full aspect-square rounded-lg bg-brand-light border-2 border-dashed border-brand-navy/20 flex items-center justify-center text-4xl hover:border-brand-gold transition-colors"
                    >
                      +
                    </button>
                  )}
                </CardContent>
              </Card>

              {/* Positions 2-7 */}
              {[1, 2, 3, 4, 5, 6].map(index => (
                <Card key={index} className="border border-brand-navy/20">
                  <CardHeader className="py-1 px-2">
                    <CardTitle className="text-xs font-medium text-brand-navy/70">Position {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    {heroSlots[index] ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <img
                          src={getThumbnailUrl(heroSlots[index]!.public_id, 200)}
                          alt={`Hero ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button size="sm" className="text-xs px-2 py-1" onClick={() => setSelectedSlot(index)}>Edit</Button>
                          <Button size="sm" variant="destructive" className="text-xs px-2 py-1" onClick={() => handleRemoveFromSlot(index)}>✕</Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedSlot(index)}
                        className="w-full aspect-square rounded-lg bg-brand-light border-2 border-dashed border-brand-navy/20 flex items-center justify-center text-2xl hover:border-brand-gold transition-colors"
                      >
                        +
                      </button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HeroGalleryManager;
