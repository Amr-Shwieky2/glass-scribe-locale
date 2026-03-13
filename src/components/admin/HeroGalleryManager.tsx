/**
 * Hero Gallery Manager - Simplified Version
 * Easy-to-use interface for selecting 7 hero images
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
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(null);
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

  // Assign selected image to a slot
  const handleAssignToSlot = async (slotIndex: number) => {
    if (!selectedImage || !token) return;
    
    setIsSaving(true);
    try {
      // Remove the image from any existing hero position
      const existingPos = getHeroPosition(selectedImage);
      if (existingPos) {
        await removeHeroPosition(selectedImage.public_id, existingPos, token);
      }

      // Remove current image from this slot if any
      const currentImage = heroSlots[slotIndex];
      if (currentImage) {
        await removeHeroPosition(currentImage.public_id, slotIndex + 1, token);
      }

      // Set new image to this position
      await setHeroPosition(selectedImage.public_id, slotIndex + 1, token);

      // Update local state
      const newSlots = [...heroSlots];
      if (existingPos) {
        newSlots[existingPos - 1] = null;
      }
      newSlots[slotIndex] = selectedImage;
      setHeroSlots(newSlots);

      // Update image tags in allImages
      setAllImages(prev => prev.map(img => {
        if (img.public_id === selectedImage.public_id) {
          const newTags = (img.tags || []).filter(t => !/^hero-[1-7]$/.test(t));
          newTags.push(`hero-${slotIndex + 1}`);
          return { ...img, tags: newTags };
        }
        if (img.public_id === currentImage?.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== `hero-${slotIndex + 1}`) };
        }
        return img;
      }));

      toast({ title: '✅ Done!', description: `Image set to position ${slotIndex + 1}` });
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to set hero position:', error);
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
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

      toast({ title: '🗑️ Removed', description: `Image removed from position ${slotIndex + 1}` });
    } catch (error) {
      console.error('Failed to remove hero position:', error);
      toast({ title: 'Error', description: 'Failed to remove from position', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Count how many slots are filled
  const filledSlots = heroSlots.filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-navy flex items-center gap-3">
            🏠 Hero Gallery
            <span className="text-sm font-normal bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full">
              {filledSlots}/7 images
            </span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-b-3 border-brand-gold" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
              <p className="font-medium text-lg mb-1">📋 How to use:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li><strong>Click an image</strong> from the gallery below to select it</li>
                <li><strong>Click a position box</strong> (1-7) above to place the image there</li>
                <li>Click ❌ on any position to remove an image</li>
              </ol>
            </div>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 flex items-center gap-4">
                <img
                  src={getThumbnailUrl(selectedImage.public_id, 120)}
                  alt="Selected"
                  className="w-24 h-24 object-cover rounded-lg shadow-lg"
                />
                <div className="flex-1">
                  <p className="font-bold text-green-800 text-lg">✅ Image Selected!</p>
                  <p className="text-green-700">Now click a position (1-7) below to place this image</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedImage(null)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Current 7 Hero Positions */}
            <div>
              <h3 className="text-lg font-bold text-brand-navy mb-3">
                📍 Hero Positions (click to {selectedImage ? 'place image' : 'remove'})
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {heroSlots.map((slot, index) => (
                  <div key={index} className="relative">
                    <div className="text-center text-xs font-bold text-brand-navy/70 mb-1">
                      {index + 1}
                    </div>
                    {slot ? (
                      <div 
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                          selectedImage 
                            ? 'border-green-400 hover:border-green-600 hover:shadow-lg' 
                            : 'border-brand-gold'
                        }`}
                        onClick={() => selectedImage ? handleAssignToSlot(index) : null}
                      >
                        <img
                          src={getThumbnailUrl(slot.public_id, 150)}
                          alt={`Hero ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {!selectedImage && (
                          <button
                            onClick={() => handleRemoveFromSlot(index)}
                            disabled={isSaving}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                          >
                            ✕
                          </button>
                        )}
                        {selectedImage && (
                          <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                              Replace
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => selectedImage ? handleAssignToSlot(index) : null}
                        disabled={!selectedImage || isSaving}
                        className={`w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center text-2xl transition-all ${
                          selectedImage 
                            ? 'border-green-400 bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-600 cursor-pointer' 
                            : 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* All Images Gallery */}
            <div>
              <h3 className="text-lg font-bold text-brand-navy mb-3">
                🖼️ All Images (click to select)
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[40vh] overflow-y-auto p-2 bg-gray-50 rounded-lg">
                {allImages.map(image => {
                  const heroPos = getHeroPosition(image);
                  const isSelected = selectedImage?.public_id === image.public_id;
                  
                  return (
                    <button
                      key={image.public_id}
                      onClick={() => setSelectedImage(isSelected ? null : image)}
                      disabled={isSaving}
                      className={`relative aspect-square rounded-lg overflow-hidden transition-all disabled:opacity-50 ${
                        isSelected 
                          ? 'ring-4 ring-green-500 scale-105 shadow-xl' 
                          : heroPos 
                            ? 'ring-2 ring-brand-gold' 
                            : 'border-2 border-transparent hover:border-brand-gold hover:scale-105'
                      }`}
                    >
                      <img
                        src={getThumbnailUrl(image.public_id, 150)}
                        alt={image.context?.custom?.alt || 'Image'}
                        className="w-full h-full object-cover"
                      />
                      {heroPos && (
                        <div className="absolute top-1 left-1 w-5 h-5 bg-brand-gold text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                          {heroPos}
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                            ✓ Selected
                          </span>
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
