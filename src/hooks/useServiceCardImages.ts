import { useState, useEffect } from 'react';
import { fetchServiceCardImages, getCategoryFromPublicId, getThumbnailUrl } from '@/lib/cloudinary';
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

export function useServiceCardImages() {
  const [serviceCardImages, setServiceCardImages] = useState<ServiceCardImageMap>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServiceCardImages = async () => {
      try {
        const response = await fetchServiceCardImages();
        const imageMap: ServiceCardImageMap = {};

        // Map each service-card tagged image to its service ID
        response.resources?.forEach((image: CloudinaryImage) => {
          const folder = getCategoryFromPublicId(image.public_id);
          // Convert Cloudinary folder name to service ID
          const serviceId = folder ? (FOLDER_TO_SERVICE[folder] || folder) : null;
          if (serviceId && !imageMap[serviceId]) {
            // Use the first service-card image found for each service
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
