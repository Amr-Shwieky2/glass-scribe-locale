/**
 * Cloudinary configuration constants and service categories.
 */

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dc1q8upxt',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'shwaki_glass_unsigned',
  baseFolder: 'shwaki-glassworks',
} as const;

export const SERVICE_CATEGORIES = [
  'shower-enclosures',
  'glass-railings',
  'mirrors',
  'storefronts',
  'partitions',
  'backsplashes',
  'shelves',
  'glass-doors',
  'hero',
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];
