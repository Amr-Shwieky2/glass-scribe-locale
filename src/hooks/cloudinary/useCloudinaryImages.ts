import { useState, useEffect, useRef, useCallback } from 'react';
import type { CloudinaryImage, CloudinaryResponse } from '@/lib/cloudinary';
import { fetchImagesByCategory, fetchAllImages } from '@/lib/cloudinary';
import { toCloudinaryCategory } from './categoryMap';
import { getCached, setCache, imageCache } from './cache';

interface UseCloudinaryResult {
  images: CloudinaryImage[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

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

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  useEffect(() => {
    if (!enabled) return;
    const cached = getCached(cacheKey);
    if (cached) { setImages(cached); setIsLoading(false); setError(null); return; }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const doFetch = async () => {
      try {
        let response: CloudinaryResponse;
        if (cldCategory) { response = await fetchImagesByCategory(cldCategory, { limit }); }
        else { response = await fetchAllImages(); }
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
        if (!cancelled && mountedRef.current) setIsLoading(false);
      }
    };
    doFetch();
    return () => { cancelled = true; };
  }, [cacheKey, cldCategory, limit, enabled, refreshKey]);

  const refresh = useCallback(() => { imageCache.delete(cacheKey); setRefreshKey(k => k + 1); }, [cacheKey]);

  return { images, isLoading, error, refresh };
}
