/**
 * Helper utilities for Cloudinary images.
 */

import { SERVICE_CATEGORIES, type ServiceCategory } from './config';
import type { CloudinaryImage } from './types';

export function getCategoryFromPublicId(publicId: string): ServiceCategory | null {
  for (const category of SERVICE_CATEGORIES) {
    if (publicId.includes(`/${category}/`)) {
      return category;
    }
  }
  return null;
}

export function formatCategoryName(category: ServiceCategory): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isFeatured(image: CloudinaryImage): boolean {
  return image.tags?.includes('featured') ?? false;
}

// Maps Cloudinary folder names to service IDs used across the app.
// Single source of truth — imported by ServiceCardManager and useServiceCardImages.
export const FOLDER_TO_SERVICE: Record<string, string> = {
  'shower-enclosures': 'shower-glass',
  'glass-railings': 'glass-railings',
  'mirrors': 'mirrors',
  'partitions': 'glass-partitions',
  'storefronts': 'storefront-glass',
  'backsplashes': 'backsplashes',
  'glass-doors': 'glass-doors',
  'shelves': 'shelves',
};
