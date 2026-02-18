import { useState, useEffect, useRef, useCallback } from 'react';
import type { CloudinaryImage } from '@/lib/cloudinary';
import { fetchFeaturedImages } from '@/lib/cloudinary';
import { getCached, setCache, imageCache } from './cache';

interface UseCloudinaryResult {
  images: CloudinaryImage[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

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
        if (!cancelled && mountedRef.current) setIsLoading(false);
      }
    };
    doFetch();
    return () => { cancelled = true; };
  }, [cacheKey, limit, enabled, refreshKey]);

  const refresh = useCallback(() => { imageCache.delete(cacheKey); setRefreshKey(k => k + 1); }, [cacheKey]);

  return { images, isLoading, error, refresh };
}
