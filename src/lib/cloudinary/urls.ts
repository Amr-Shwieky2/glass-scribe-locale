/**
 * Cloudinary URL transformation utilities.
 */

import { CLOUDINARY_CONFIG } from './config';

export function buildImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    gravity?: 'auto' | 'face' | 'center';
    blur?: number;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    blur,
  } = options;

  const transformations: string[] = [];
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) {
    transformations.push(`c_${crop}`);
    if (crop === 'fill' || crop === 'thumb') {
      transformations.push(`g_${gravity}`);
    }
  }
  if (blur) transformations.push(`e_blur:${blur}`);

  const transformString = transformations.join(',');
  const { cloudName } = CLOUDINARY_CONFIG;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

export function getThumbnailUrl(publicId: string, size = 300): string {
  return buildImageUrl(publicId, { width: size, height: size, crop: 'fill', gravity: 'auto', quality: 'auto', format: 'auto' });
}

export function getGalleryUrl(publicId: string): string {
  return buildImageUrl(publicId, { width: 1200, quality: 'auto', format: 'auto', crop: 'fit' });
}

export function getHeroUrl(publicId: string): string {
  return buildImageUrl(publicId, { width: 1920, height: 1080, quality: 'auto', format: 'auto', crop: 'fill', gravity: 'auto' });
}

export function getPlaceholderUrl(publicId: string): string {
  return buildImageUrl(publicId, { width: 50, quality: 30, format: 'webp', blur: 1000 });
}
