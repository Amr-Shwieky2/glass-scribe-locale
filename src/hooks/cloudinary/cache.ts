import type { CloudinaryImage } from '@/lib/cloudinary';

export interface CacheEntry {
  images: CloudinaryImage[];
  timestamp: number;
}

export const imageCache = new Map<string, CacheEntry>();
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function getCached(key: string): CloudinaryImage[] | null {
  const entry = imageCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    imageCache.delete(key);
    return null;
  }
  return entry.images;
}

export function setCache(key: string, images: CloudinaryImage[]) {
  imageCache.set(key, { images, timestamp: Date.now() });
}
