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
