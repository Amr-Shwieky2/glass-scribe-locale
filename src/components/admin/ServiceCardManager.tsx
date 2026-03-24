/**
 * Service Card Image Manager
 * Allows admin to select which image represents each service
 */
import { useState, useEffect, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useToast } from '@/hooks/use-toast';
import {
  type CloudinaryImage,
  fetchAllImages,
  getThumbnailUrl,
  getCategoryFromPublicId,
} from '@/lib/cloudinary';
import { setServiceCardImage, removeServiceCardImage } from '@/lib/cloudinary/admin-api';
import { SERVICES } from '@/data/services';
import { getLocalizedText, type SupportedLocale } from '@/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ServiceCardManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Map Cloudinary folder names to service IDs
const FOLDER_TO_SERVICE: Record<string, string> = {
  'shower-enclosures': 'shower-glass',
  'glass-railings': 'glass-railings',
  'mirrors': 'mirrors',
  'partitions': 'glass-partitions',
  'storefronts': 'storefront-glass',
  'backsplashes': 'backsplashes',
  'glass-doors': 'glass-doors',
  'shelves': 'shelves',
};

// Get service ID from image tags (service-card-shower-glass, etc.)
const getServiceCardId = (image: CloudinaryImage): string | null => {
  const serviceTag = image.tags?.find(tag => tag.startsWith('service-card-'));
  if (serviceTag) {
    return serviceTag.replace('service-card-', '');
  }
  return null;
};

const ServiceCardManager: FC<ServiceCardManagerProps> = ({ open, onOpenChange }) => {
  const { token } = useAdmin();
  const { toast } = useToast();
  const [allImages, setAllImages] = useState<CloudinaryImage[]>([]);
  const [serviceImages, setServiceImages] = useState<Record<string, CloudinaryImage | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize service images map
  useEffect(() => {
    if (!open) return;
    
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllImages();
        const images = response.resources || [];
        setAllImages(images);

        // Build service images map
        const imageMap: Record<string, CloudinaryImage | null> = {};
        SERVICES.forEach(service => {
          imageMap[service.id] = null;
        });

        // Find images with service-card-{serviceId} tags
        images.forEach(img => {
          const serviceId = getServiceCardId(img);
          if (serviceId && serviceId in imageMap) {
            imageMap[serviceId] = img;
          }
        });

        setServiceImages(imageMap);
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
    if (selectedService === null || !token) return;
    
    setIsSaving(true);
    try {
      // Remove the image from any existing service card assignment
      const existingServiceId = getServiceCardId(image);
      if (existingServiceId) {
        await removeServiceCardImage(image.public_id, existingServiceId, token);
      }

      // Remove current image from this service if any
      const currentImage = serviceImages[selectedService];
      if (currentImage) {
        await removeServiceCardImage(currentImage.public_id, selectedService, token);
      }

      // Set new image for this service
      await setServiceCardImage(image.public_id, selectedService, token);

      // Update local state
      const newServiceImages = { ...serviceImages };
      // Clear the old service if image was moved
      if (existingServiceId && existingServiceId !== selectedService) {
        newServiceImages[existingServiceId] = null;
      }
      newServiceImages[selectedService] = image;
      setServiceImages(newServiceImages);

      // Update image tags in allImages
      setAllImages(prev => prev.map(img => {
        if (img.public_id === image.public_id) {
          const newTags = (img.tags || []).filter(t => !t.startsWith('service-card-'));
          newTags.push(`service-card-${selectedService}`);
          return { ...img, tags: newTags };
        }
        if (img.public_id === currentImage?.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== `service-card-${selectedService}`) };
        }
        return img;
      }));

      const service = SERVICES.find(s => s.id === selectedService);
      const serviceName = service ? getLocalizedText(service.title, 'en' as SupportedLocale) : selectedService;
      toast({ title: 'Success', description: `Image set for ${serviceName}` });
      setSelectedService(null);
    } catch (error) {
      console.error('Failed to set service card image:', error);
      toast({ title: 'Error', description: 'Failed to update service image', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromService = async (serviceId: string) => {
    if (!token) return;
    const image = serviceImages[serviceId];
    if (!image) return;

    setIsSaving(true);
    try {
      await removeServiceCardImage(image.public_id, serviceId, token);

      const newServiceImages = { ...serviceImages };
      newServiceImages[serviceId] = null;
      setServiceImages(newServiceImages);

      setAllImages(prev => prev.map(img => {
        if (img.public_id === image.public_id) {
          return { ...img, tags: (img.tags || []).filter(t => t !== `service-card-${serviceId}`) };
        }
        return img;
      }));

      const service = SERVICES.find(s => s.id === serviceId);
      const serviceName = service ? getLocalizedText(service.title, 'en' as SupportedLocale) : serviceId;
      toast({ title: 'Removed', description: `Image removed from ${serviceName}` });
    } catch (error) {
      console.error('Failed to remove service card image:', error);
      toast({ title: 'Error', description: 'Failed to remove image', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Get images that could be used for the selected service
  // Prioritize images from the matching category folder
  const getAvailableImages = () => {
    if (!selectedService) return [];
    
    // Find folder name that maps to this service
    const matchingFolder = Object.entries(FOLDER_TO_SERVICE).find(([, serviceId]) => serviceId === selectedService)?.[0];
    
    // Sort images: matching category first, then others
    return [...allImages].sort((a, b) => {
      const aFolder = getCategoryFromPublicId(a.public_id);
      const bFolder = getCategoryFromPublicId(b.public_id);
      const aMatches = aFolder === matchingFolder || aFolder === selectedService;
      const bMatches = bFolder === matchingFolder || bFolder === selectedService;
      
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-navy">
            🏷️ Manage Service Card Images (השירותים שלנו)
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-gold" />
          </div>
        ) : selectedService !== null ? (
          /* Image Selection View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-navy">
                Select image for: {(() => {
                  const service = SERVICES.find(s => s.id === selectedService);
                  return service ? getLocalizedText(service.title, 'en' as SupportedLocale) : selectedService;
                })()}
              </h3>
              <Button variant="outline" onClick={() => setSelectedService(null)}>
                ← Back
              </Button>
            </div>
            <p className="text-sm text-brand-navy/70">
              Images from matching categories are shown first.
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto">
              {getAvailableImages().map(image => (
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
                  {/* Show category badge */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <span className="text-[10px] bg-black/60 text-white px-1 py-0.5 rounded truncate block">
                      {getCategoryFromPublicId(image.public_id) || 'hero'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Services Grid View */
          <div className="space-y-4">
            <p className="text-sm text-brand-navy/70">
              Select an image for each service. This image will appear in the "Our Services" section on the home page.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SERVICES.map(service => (
                <Card key={service.id} className="border border-brand-navy/20">
                  <CardHeader className="py-2 px-3">
                    <CardTitle className="text-sm font-medium text-brand-navy flex items-center gap-2">
                      <span>{service.icon}</span>
                      {getLocalizedText(service.title, 'en' as SupportedLocale)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    {serviceImages[service.id] ? (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                        <img
                          src={getThumbnailUrl(serviceImages[service.id]!.public_id, 300)}
                          alt={getLocalizedText(service.title, 'en' as SupportedLocale)}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" onClick={() => setSelectedService(service.id)}>Change</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRemoveFromService(service.id)}>✕</Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedService(service.id)}
                        className="w-full aspect-[4/3] rounded-lg bg-brand-light border-2 border-dashed border-brand-navy/20 flex flex-col items-center justify-center gap-2 hover:border-brand-gold transition-colors"
                      >
                        <span className="text-3xl">{service.icon}</span>
                        <span className="text-xs text-brand-navy/50">Click to select</span>
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

export default ServiceCardManager;
