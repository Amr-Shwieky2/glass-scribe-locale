/**
 * Hero Gallery Manager - Easy Admin Version
 * Big images, simple drag workflow
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

interface PendingChange {
  type: 'add' | 'remove';
  publicId: string;
  position: number;
}

const HeroGalleryManager: FC<HeroGalleryManagerProps> = ({ open, onOpenChange }) => {
  const { token } = useAdmin();
  const { toast } = useToast();
  const [allImages, setAllImages] = useState<CloudinaryImage[]>([]);
  const [heroSlots, setHeroSlots] = useState<(CloudinaryImage | null)[]>(Array(7).fill(null));
  const [originalSlots, setOriginalSlots] = useState<(CloudinaryImage | null)[]>(Array(7).fill(null));
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<CloudinaryImage | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);

  // Load all images and organize hero slots
  useEffect(() => {
    if (!open) return;
    
    const loadImages = async () => {
      setIsLoading(true);
      setPendingChanges([]);
      try {
        // Fetch both all images AND hero position images to ensure we get everything
        const [allResponse, heroResponse] = await Promise.all([
          fetchAllImages(),
          fetchHeroPositionImages()
        ]);
        
        const allImgs = allResponse.resources || [];
        const heroImgs = heroResponse.resources || [];
        
        // Merge and deduplicate - hero images first to ensure they're included
        const imageMap = new Map<string, CloudinaryImage>();
        heroImgs.forEach(img => imageMap.set(img.public_id, img));
        allImgs.forEach(img => {
          if (!imageMap.has(img.public_id)) {
            imageMap.set(img.public_id, img);
          }
        });
        
        const images = Array.from(imageMap.values());
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
        setOriginalSlots([...slots]);
      } catch (error) {
        console.error('Failed to load images:', error);
        toast({ title: 'שגיאה', description: 'נכשל בטעינת תמונות', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [open, toast]);

  // Assign selected image to a slot (local only - no API call yet)
  const handleAssignToSlot = (slotIndex: number) => {
    if (!selectedImage) return;
    
    const newSlots = [...heroSlots];
    
    // Find if this image is already in another slot
    const existingSlotIndex = newSlots.findIndex(
      slot => slot?.public_id === selectedImage.public_id
    );
    
    // If moving from another slot, clear that slot
    if (existingSlotIndex !== -1 && existingSlotIndex !== slotIndex) {
      newSlots[existingSlotIndex] = null;
    }
    
    // Place image in new slot
    newSlots[slotIndex] = selectedImage;
    setHeroSlots(newSlots);
    setSelectedImage(null);
    
    toast({ title: '✅ בוצע', description: `תמונה הועברה למיקום ${slotIndex + 1}. לחץ "שמור שינויים" לסיום` });
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    const newSlots = [...heroSlots];
    newSlots[slotIndex] = null;
    setHeroSlots(newSlots);
    toast({ title: '🗑️ הוסר', description: `תמונה הוסרה ממיקום ${slotIndex + 1}. לחץ "שמור שינויים" לסיום` });
  };

  // Check if there are unsaved changes
  const hasChanges = JSON.stringify(heroSlots.map(s => s?.public_id)) !== 
                     JSON.stringify(originalSlots.map(s => s?.public_id));

  // Save all changes to the server
  const handleSaveChanges = async () => {
    if (!token) return;
    
    setIsSaving(true);
    try {
      // Find what changed
      const changes: PendingChange[] = [];
      
      // Check each slot
      for (let i = 0; i < 7; i++) {
        const original = originalSlots[i];
        const current = heroSlots[i];
        
        // If original had an image that's no longer there
        if (original && (!current || current.public_id !== original.public_id)) {
          changes.push({ type: 'remove', publicId: original.public_id, position: i + 1 });
        }
        
        // If current has an image that wasn't there originally
        if (current && (!original || current.public_id !== original.public_id)) {
          // Also check if this image needs to be removed from its old position
          const oldPos = getHeroPosition(current);
          if (oldPos && oldPos !== i + 1) {
            changes.push({ type: 'remove', publicId: current.public_id, position: oldPos });
          }
          changes.push({ type: 'add', publicId: current.public_id, position: i + 1 });
        }
      }
      
      // Apply all changes
      for (const change of changes) {
        if (change.type === 'remove') {
          await removeHeroPosition(change.publicId, change.position, token);
        } else {
          await setHeroPosition(change.publicId, change.position, token);
        }
      }
      
      // Update original slots to match current
      setOriginalSlots([...heroSlots]);
      
      // Update image tags in allImages
      setAllImages(prev => prev.map(img => {
        const newSlotIndex = heroSlots.findIndex(s => s?.public_id === img.public_id);
        const newTags = (img.tags || []).filter(t => !/^hero-[1-7]$/.test(t));
        if (newSlotIndex !== -1) {
          newTags.push(`hero-${newSlotIndex + 1}`);
        }
        return { ...img, tags: newTags };
      }));
      
      toast({ title: '✅ נשמר!', description: 'כל השינויים נשמרו בהצלחה' });
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast({ title: 'שגיאה', description: 'נכשל בשמירת שינויים', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel all changes
  const handleCancelChanges = () => {
    setHeroSlots([...originalSlots]);
    setSelectedImage(null);
    toast({ title: '↩️ בוטל', description: 'השינויים בוטלו' });
  };

  // Count how many slots are filled
  const filledSlots = heroSlots.filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen && hasChanges) {
        if (confirm('יש שינויים שלא נשמרו. האם אתה בטוח שברצונך לצאת?')) {
          onOpenChange(false);
        }
      } else {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-brand-navy flex items-center gap-3 flex-wrap">
            <span>🏠 גלריית ראשי</span>
            <span className="text-sm font-normal bg-brand-gold/20 text-brand-gold px-3 py-1 rounded-full">
              {filledSlots}/7 תמונות
            </span>
            {hasChanges && (
              <span className="text-sm font-normal bg-orange-100 text-orange-600 px-3 py-1 rounded-full animate-pulse">
                ⚠️ יש שינויים שלא נשמרו
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-gold" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Save/Cancel Buttons - Always visible when there are changes */}
            {hasChanges && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 flex items-center justify-between gap-4 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-bold text-orange-800">יש לך שינויים שלא נשמרו!</span>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleCancelChanges}
                    disabled={isSaving}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    ❌ בטל שינויים
                  </Button>
                  <Button 
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-6"
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span> שומר...
                      </span>
                    ) : (
                      '💾 שמור שינויים'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-bold text-blue-800 text-lg mb-2">📋 :איך להשתמש</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700 text-right" dir="rtl">
                <li><strong>לחץ על תמונה</strong> מהגלריה למטה כדי לבחור אותה</li>
                <li><strong>לחץ על מיקום</strong> (1-7) כדי למקם את התמונה שם</li>
                <li>לחץ על ❌ כדי להסיר תמונה ממיקום</li>
                <li><strong className="text-green-700">לחץ "שמור שינויים"</strong> כדי לשמור את השינויים!</li>
              </ol>
            </div>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 flex items-center gap-4">
                <img
                  src={getThumbnailUrl(selectedImage.public_id, 200)}
                  alt="Selected"
                  className="w-32 h-32 object-cover rounded-lg shadow-lg"
                />
                <div className="flex-1 text-right" dir="rtl">
                  <p className="font-bold text-green-800 text-xl">✅ תמונה נבחרה!</p>
                  <p className="text-green-700 text-lg">עכשיו לחץ על מיקום (1-7) למטה כדי למקם את התמונה</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedImage(null)}
                  className="text-red-600 border-red-300 hover:bg-red-50 text-lg px-6"
                >
                  ביטול
                </Button>
              </div>
            )}

            {/* Current 7 Hero Positions - BIGGER */}
            <div>
              <h3 className="text-xl font-bold text-brand-navy mb-4 text-right" dir="rtl">
                📍 מיקומי גלריה (לחץ כדי {selectedImage ? 'למקם' : 'להסיר'})
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
                {heroSlots.map((slot, index) => (
                  <div key={index} className="relative">
                    <div className="text-center text-lg font-bold text-brand-navy mb-2">
                      {index + 1}
                    </div>
                    {slot ? (
                      <div 
                        className={`relative aspect-square rounded-xl overflow-hidden border-3 transition-all cursor-pointer group shadow-lg ${
                          selectedImage 
                            ? 'border-green-400 hover:border-green-600 hover:shadow-2xl hover:scale-105' 
                            : 'border-brand-gold hover:border-red-400'
                        }`}
                        onClick={() => selectedImage ? handleAssignToSlot(index) : null}
                      >
                        <img
                          src={getThumbnailUrl(slot.public_id, 300)}
                          alt={`Hero ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {!selectedImage && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemoveFromSlot(index); }}
                            disabled={isSaving}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-600 hover:scale-110 transition-all disabled:opacity-50"
                          >
                            ✕
                          </button>
                        )}
                        {selectedImage && (
                          <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
                            <span className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg">
                              החלף
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => selectedImage ? handleAssignToSlot(index) : null}
                        disabled={!selectedImage || isSaving}
                        className={`w-full aspect-square rounded-xl border-3 border-dashed flex items-center justify-center text-4xl transition-all ${
                          selectedImage 
                            ? 'border-green-400 bg-green-50 text-green-600 hover:bg-green-100 hover:border-green-600 hover:scale-105 cursor-pointer shadow-lg' 
                            : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        +
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* All Images Gallery - MUCH BIGGER */}
            <div>
              <h3 className="text-xl font-bold text-brand-navy mb-4 text-right" dir="rtl">
                🖼️ כל התמונות (לחץ לבחירה)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[50vh] overflow-y-auto p-3 bg-gray-50 rounded-xl">
                {allImages.map(image => {
                  const heroPos = heroSlots.findIndex(s => s?.public_id === image.public_id) + 1;
                  const isSelected = selectedImage?.public_id === image.public_id;
                  
                  return (
                    <button
                      key={image.public_id}
                      onClick={() => setSelectedImage(isSelected ? null : image)}
                      disabled={isSaving}
                      className={`relative aspect-square rounded-xl overflow-hidden transition-all disabled:opacity-50 shadow-md hover:shadow-xl ${
                        isSelected 
                          ? 'ring-4 ring-green-500 scale-105 shadow-2xl' 
                          : heroPos > 0
                            ? 'ring-3 ring-brand-gold' 
                            : 'border-2 border-transparent hover:border-brand-gold hover:scale-105'
                      }`}
                    >
                      <img
                        src={getThumbnailUrl(image.public_id, 300)}
                        alt={image.context?.custom?.alt || 'תמונה'}
                        className="w-full h-full object-cover"
                      />
                      {heroPos > 0 && (
                        <div className="absolute top-2 left-2 w-8 h-8 bg-brand-gold text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                          {heroPos}
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                          <span className="bg-green-600 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
                            ✓ נבחר
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Save Button */}
            {hasChanges && (
              <div className="flex justify-center gap-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleCancelChanges}
                  disabled={isSaving}
                  className="border-red-300 text-red-600 hover:bg-red-50 text-lg px-8 py-3"
                >
                  ❌ בטל
                </Button>
                <Button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3"
                >
                  {isSaving ? '⏳ שומר...' : '💾 שמור שינויים'}
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HeroGalleryManager;
