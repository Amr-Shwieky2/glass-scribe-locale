import type { ServiceCategory } from '@/lib/cloudinary';

/**
 * Maps service IDs (from business.ts) and project category IDs
 * to Cloudinary folder names (ServiceCategory).
 */
export const SERVICE_TO_CLOUDINARY: Record<string, ServiceCategory> = {
  'shower-glass': 'shower-enclosures',
  'glass-railings': 'glass-railings',
  'mirrors': 'mirrors',
  'glass-partitions': 'partitions',
  'storefront-glass': 'storefronts',
  'shower': 'shower-enclosures',
  'storefront': 'storefronts',
  'custom': 'backsplashes',
  'partitions': 'partitions',
  'storefronts': 'storefronts',
  'backsplashes': 'backsplashes',
  'shelves': 'shelves',
  'glass-doors': 'glass-doors',
  'hero': 'hero',
  'shower-enclosures': 'shower-enclosures',
};

/**
 * Convert any service/project category ID to a Cloudinary folder name
 */
export function toCloudinaryCategory(serviceOrCategoryId: string): ServiceCategory {
  return SERVICE_TO_CLOUDINARY[serviceOrCategoryId] || (serviceOrCategoryId as ServiceCategory);
}
