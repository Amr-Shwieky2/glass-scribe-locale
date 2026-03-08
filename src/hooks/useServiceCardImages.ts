import { useState, useEffect } from 'react';
import { fetchServiceCardImages, fetchServiceCardTagImages, getCategoryFromPublicId, getThumbnailUrl } from '@/lib/cloudinary';
import type { CloudinaryImage } from '@/lib/cloudinary';

export type ServiceCardImageMap = Record<string, string>;

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
  'lobbies': 'lobbies',
};

// Get service ID from service-card-{serviceId} tag
const getServiceCardId = (image: CloudinaryImage): string | null => {
  const serviceTag = image.tags?.find(tag => tag.startsWith('service-card-'));
  if (serviceTag) {
    return serviceTag.replace('service-card-', '');
  }
  return null;
};

export function useServiceCardImages() {
  const [serviceCardImages, setServiceCardImages] = useState<ServiceCardImageMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServiceCardImages = async () => {
      try {
        const imageMap: ServiceCardImageMap = {};

        // First, try to fetch images with service-card-{serviceId} tags (new system)
        try {
          const taggedResponse = await fetchServiceCardTagImages();
          const taggedImages = taggedResponse.resources || [];
          
          taggedImages.forEach((image: CloudinaryImage) => {
            const serviceId = getServiceCardId(image);
            if (serviceId && !imageMap[serviceId]) {
              imageMap[serviceId] = getThumbnailUrl(image.public_id, 600);
            }
          });
        } catch (err) {
          console.warn('Failed to fetch service-card-{id} tagged images:', err);
        }

        // Fall back to legacy service-card tag system for services without specific images
        const response = await fetchServiceCardImages();
        response.resources?.forEach((image: CloudinaryImage) => {
          const folder = getCategoryFromPublicId(image.public_id);
          // Convert Cloudinary folder name to service ID
          const serviceId = folder ? (FOLDER_TO_SERVICE[folder] || folder) : null;
          if (serviceId && !imageMap[serviceId]) {
            // Use the first service-card image found for each service (only if not already set)
            imageMap[serviceId] = getThumbnailUrl(image.public_id, 600);
          }
        });

        setServiceCardImages(imageMap);
      } catch (error) {
        console.error('Failed to load service card images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadServiceCardImages();
  }, []);

  return { serviceCardImages, isLoading };
}
