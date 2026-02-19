import { useState, useEffect, useRef, useCallback } from 'react';
import type { CloudinaryImage } from '@/lib/cloudinary';
import { fetchHeroImages, fetchHeroGalleryImages } from '@/lib/cloudinary';
import { getCached, setCache, imageCache } from './cache';

interface UseCloudinaryResult {
  images: CloudinaryImage[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useHeroImages(
  options: { enabled?: boolean } = {}
): UseCloudinaryResult {
  const { enabled = true } = options;
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const cacheKey = 'hero-gallery:10';

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
        // First try to fetch images with hero-gallery tag
        const heroGalleryResponse = await fetchHeroGalleryImages();
        let imgs = heroGalleryResponse.resources || [];
        
        // If no hero-gallery tagged images, fall back to hero folder
        if (imgs.length === 0) {
          const heroFolderResponse = await fetchHeroImages();
          imgs = heroFolderResponse.resources || [];
        }
        
        if (!cancelled && mountedRef.current) {
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
        if (!cancelled && mountedRef.current) setIsLoading(false);
      }
    };
    doFetch();
    return () => { cancelled = true; };
  }, [cacheKey, enabled, refreshKey]);

  const refresh = useCallback(() => { imageCache.delete(cacheKey); setRefreshKey(k => k + 1); }, [cacheKey]);

  return { images, isLoading, error, refresh };
}
