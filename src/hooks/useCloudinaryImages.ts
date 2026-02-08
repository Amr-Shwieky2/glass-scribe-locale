/**
 * @fileoverview Cloudinary Image Hooks for Public Pages
 * @description React hooks that fetch images from Cloudinary via the serverless API.
 * Used by public-facing pages (Home, Projects, Services, HeroGallery) to display
 * images uploaded by the admin.
 *
 * FEATURES:
 * - In-memory cache to avoid refetching on navigation
 * - Loading & error states
 * - Graceful fallback when no images exist
 * - Category mapping between service IDs and Cloudinary folders
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  type CloudinaryImage,
  type CloudinaryResponse,
  type ServiceCategory,
  fetchImagesByCategory,
  fetchAllImages,
  fetchFeaturedImages,
  fetchHeroImages,
  getThumbnailUrl,
  getGalleryUrl,
  getHeroUrl,
  getPlaceholderUrl,
} from '@/lib/cloudinary';

// =============================================================================
// CATEGORY MAPPING
// =============================================================================

/**
 * Maps service IDs (from business.ts) and project category IDs
 * to Cloudinary folder names (ServiceCategory).
 *
 * Service IDs:        shower-glass, glass-railings, mirrors, glass-partitions, storefront-glass, custom-glass
 * Cloudinary folders: shower-enclosures, glass-railings, mirrors, storefronts, partitions, lobbies, backsplashes, shelves, glass-doors, hero
 */
const SERVICE_TO_CLOUDINARY: Record<string, ServiceCategory> = {
  // Service IDs from business.ts
  'shower-glass': 'shower-enclosures',
  'glass-railings': 'glass-railings',
  'mirrors': 'mirrors',
  'glass-partitions': 'partitions',
  'storefront-glass': 'storefronts',
  'custom-glass': 'backsplashes', // custom work often shown via backsplashes/shelves

  // Project category IDs from Projects.tsx
  'shower': 'shower-enclosures',
  'storefront': 'storefronts',
  'custom': 'backsplashes',
  'partitions': 'partitions',
  'storefronts': 'storefronts',
  'lobbies': 'lobbies',
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

// =============================================================================
// IN-MEMORY CACHE
// =============================================================================

interface CacheEntry {
  images: CloudinaryImage[];
  timestamp: number;
}

const imageCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string): CloudinaryImage[] | null {
  const entry = imageCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    imageCache.delete(key);
    return null;
  }
  return entry.images;
}

function setCache(key: string, images: CloudinaryImage[]) {
  imageCache.set(key, { images, timestamp: Date.now() });
}

// =============================================================================
// HOOKS
// =============================================================================

interface UseCloudinaryResult {
  images: CloudinaryImage[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Fetch images for a specific Cloudinary category.
 * Accepts either a Cloudinary folder name or a service/project category ID.
 */
export function useCloudinaryImages(
  categoryId: string | undefined,
  options: { limit?: number; enabled?: boolean } = {}
): UseCloudinaryResult {
  const { limit = 50, enabled = true } = options;
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const cldCategory = categoryId ? toCloudinaryCategory(categoryId) : undefined;
  const cacheKey = cldCategory ? `category:${cldCategory}:${limit}` : `all:${limit}`;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cached = getCached(cacheKey);
    if (cached) {
      setImages(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        let response: CloudinaryResponse;
        if (cldCategory) {
          response = await fetchImagesByCategory(cldCategory, { limit });
        } else {
          response = await fetchAllImages();
        }
        if (!cancelled && mountedRef.current) {
          const imgs = response.resources || [];
          setImages(imgs);
          setCache(cacheKey, imgs);
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          console.error('[useCloudinaryImages] Fetch error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load images');
          setImages([]);
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    doFetch();
    return () => { cancelled = true; };
  }, [cacheKey, cldCategory, limit, enabled, refreshKey]);

  const refresh = useCallback(() => {
    imageCache.delete(cacheKey);
    setRefreshKey(k => k + 1);
  }, [cacheKey]);

  return { images, isLoading, error, refresh };
}

/**
 * Fetch featured images (tagged "featured" in Cloudinary).
 */
export function useFeaturedImages(
  options: { limit?: number; enabled?: boolean } = {}
): UseCloudinaryResult {
  const { limit = 20, enabled = true } = options;
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const cacheKey = `featured:${limit}`;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cached = getCached(cacheKey);
    if (cached) {
      setImages(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        const response = await fetchFeaturedImages();
        if (!cancelled && mountedRef.current) {
          const imgs = response.resources || [];
          setImages(imgs);
          setCache(cacheKey, imgs);
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          console.error('[useFeaturedImages] Fetch error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load images');
          setImages([]);
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    doFetch();
    return () => { cancelled = true; };
  }, [cacheKey, limit, enabled, refreshKey]);

  const refresh = useCallback(() => {
    imageCache.delete(cacheKey);
    setRefreshKey(k => k + 1);
  }, [cacheKey]);

  return { images, isLoading, error, refresh };
}

/**
 * Fetch hero images from the "hero" folder in Cloudinary.
 */
export function useHeroImages(
  options: { enabled?: boolean } = {}
): UseCloudinaryResult {
  const { enabled = true } = options;
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const cacheKey = 'hero:10';

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const cached = getCached(cacheKey);
    if (cached) {
      setImages(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        const response = await fetchHeroImages();
        if (!cancelled && mountedRef.current) {
          const imgs = response.resources || [];
          setImages(imgs);
          setCache(cacheKey, imgs);
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          console.error('[useHeroImages] Fetch error:', err);
          setError(err instanceof Error ? err.message : 'Failed to load images');
          setImages([]);
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    doFetch();
    return () => { cancelled = true; };
  }, [cacheKey, enabled, refreshKey]);

  const refresh = useCallback(() => {
    imageCache.delete(cacheKey);
    setRefreshKey(k => k + 1);
  }, [cacheKey]);

  return { images, isLoading, error, refresh };
}

// =============================================================================
// RE-EXPORTS for convenience
// =============================================================================

export { getThumbnailUrl, getGalleryUrl, getHeroUrl, getPlaceholderUrl };
export type { CloudinaryImage };
