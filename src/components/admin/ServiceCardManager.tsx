'use client';
/**
 * Service Card Image Manager
 * Allows admin to select which image represents each service
 */
import { useState, useEffect, type FC } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  type CloudinaryImage,
  fetchAllImages,
  getThumbnailUrl,
  getCategoryFromPublicId,
  FOLDER_TO_SERVICE,
} from '@/lib/cloudinary';
import { setServiceCardImage, removeServiceCardImage } from '@/lib/cloudinary/admin-api';
import { SERVICES } from '@/data/services';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const BROKEN_IMG_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='40'%3E%F0%9F%96%BC%3C/text%3E%3C/svg%3E";

interface ServiceCardManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Get service ID from service-card-{serviceId} tag
const getServiceCardId = (image: CloudinaryImage): string | null => {
  const serviceTag = image.tags?.find(tag => tag.startsWith('service-card-'));
  if (serviceTag) {
    return serviceTag.replace('service-card-', '');
  }
  return null;
};

const ServiceCardManager: FC<ServiceCardManagerProps> = ({ open, onOpenChange }) => {
  const { isAuthenticated } = useAdmin();
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as AdminLocale;
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);

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
        toast({ title: t(ADMIN_STRINGS.serviceManager.errorLoadTitle), description: t(ADMIN_STRINGS.serviceManager.errorLoadDesc), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectImage = async (image: CloudinaryImage) => {
    if (selectedService === null || !isAuthenticated) return;

    setIsSaving(true);
    try {
      // Remove the image from any existing service card assignment
      const existingServiceId = getServiceCardId(image);
      if (existingServiceId) {
        await removeServiceCardImage(image.public_id, existingServiceId);
      }

      // Remove current image from this service if any
      const currentImage = serviceImages[selectedService];
      if (currentImage) {
        await removeServiceCardImage(currentImage.public_id, selectedService);
      }

      // Set new image for this service
      await setServiceCardImage(image.public_id, selectedService);

      // Update local state
      const newServiceImages = { ...serviceImages };
      // Clear the old service if image was moved from another service
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
      const serviceName = service ? getLocalizedText(service.title, locale as SupportedLocale) : selectedService;
      toast({ title: t(ADMIN_STRINGS.serviceManager.successTitle), description: `${t(ADMIN_STRINGS.serviceManager.successDesc)} ${serviceName}` });
      setSelectedService(null);
    } catch (error) {
      console.error('Failed to set service card image:', error);
      toast({ title: t(ADMIN_STRINGS.serviceManager.errorTitle), description: t(ADMIN_STRINGS.serviceManager.errorUpdateDesc), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFromService = async (serviceId: string) => {
    if (!isAuthenticated) return;
    const image = serviceImages[serviceId];
    if (!image) return;

    setIsSaving(true);
    try {
      await removeServiceCardImage(image.public_id, serviceId);

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
      const serviceName = service ? getLocalizedText(service.title, locale as SupportedLocale) : serviceId;
      toast({ title: t(ADMIN_STRINGS.serviceManager.removedTitle), description: `${t(ADMIN_STRINGS.serviceManager.removedDesc)} ${serviceName}` });
    } catch (error) {
      console.error('Failed to remove service card image:', error);
      toast({ title: t(ADMIN_STRINGS.serviceManager.errorTitle), description: t(ADMIN_STRINGS.serviceManager.errorRemoveDesc), variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  // Get images sorted: matching category first, then others
  const getAvailableImages = () => {
    if (!selectedService) return [];

    const matchingFolder = Object.entries(FOLDER_TO_SERVICE).find(([, serviceId]) => serviceId === selectedService)?.[0];

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

  const getCategoryLabel = (image: CloudinaryImage): string => {
    const folder = getCategoryFromPublicId(image.public_id);
    if (!folder) return '';
    const key = folder as keyof typeof ADMIN_STRINGS.categories;
    return ADMIN_STRINGS.categories[key] ? t(ADMIN_STRINGS.categories[key]) : folder;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-brand-navy">
            {t(ADMIN_STRINGS.serviceManager.title)}
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
                {t(ADMIN_STRINGS.serviceManager.selectImageFor)}{' '}
                {(() => {
                  const service = SERVICES.find(s => s.id === selectedService);
                  return service ? getLocalizedText(service.title, locale as SupportedLocale) : selectedService;
                })()}
              </h3>
              <Button variant="outline" onClick={() => setSelectedService(null)}>
                {t(ADMIN_STRINGS.serviceManager.back)}
              </Button>
            </div>
            <p className="text-sm text-brand-navy/70">
              {t(ADMIN_STRINGS.serviceManager.categoryHint)}
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
                    alt={image.context?.custom?.alt || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = BROKEN_IMG_FALLBACK; }}
                  />
                  {/* Category badge */}
                  <div className="absolute bottom-1 left-1 right-1">
                    <span className="text-[10px] bg-black/60 text-white px-1 py-0.5 rounded truncate block">
                      {getCategoryLabel(image)}
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
              {t(ADMIN_STRINGS.serviceManager.instruction)}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SERVICES.map(service => (
                <Card key={service.id} className="border border-brand-navy/20">
                  <CardHeader className="py-2 px-3">
                    <CardTitle className="text-sm font-medium text-brand-navy flex items-center gap-2">
                      <span>{service.icon}</span>
                      {getLocalizedText(service.title, locale as SupportedLocale)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    {serviceImages[service.id] ? (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                        <img
                          src={getThumbnailUrl(serviceImages[service.id]!.public_id, 300)}
                          alt={getLocalizedText(service.title, locale as SupportedLocale)}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = BROKEN_IMG_FALLBACK; }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" onClick={() => setSelectedService(service.id)}>
                            {t(ADMIN_STRINGS.serviceManager.change)}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRemoveFromService(service.id)}>✕</Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedService(service.id)}
                        className="w-full aspect-[4/3] rounded-lg bg-brand-light border-2 border-dashed border-brand-navy/20 flex flex-col items-center justify-center gap-2 hover:border-brand-gold transition-colors"
                      >
                        <span className="text-3xl">{service.icon}</span>
                        <span className="text-xs text-brand-navy/50">{t(ADMIN_STRINGS.serviceManager.clickToSelect)}</span>
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
