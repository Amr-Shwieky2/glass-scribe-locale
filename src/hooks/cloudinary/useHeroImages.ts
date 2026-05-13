'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import type { CloudinaryImage } from '@/lib/cloudinary';
import { fetchHeroImages, fetchHeroGalleryImages, fetchHeroPositionImages } from '@/lib/cloudinary';
import { getCached, setCache, imageCache } from './cache';

interface UseCloudinaryResult {
  images: CloudinaryImage[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

// Get hero position from image tags (hero-1, hero-2, etc.)
const getHeroPosition = (image: CloudinaryImage): number | null => {
  const heroTag = image.tags?.find(tag => /^hero-[1-7]$/.test(tag));
  if (heroTag) {
    return parseInt(heroTag.split('-')[1], 10);
  }
  return null;
};

export function useHeroImages(
  options: { enabled?: boolean } = {}
): UseCloudinaryResult {
  const { enabled = true } = options;
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const cacheKey = 'hero-positions:7';

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
        // First try to fetch images with hero position tags (hero-1 to hero-7)
        const heroPositionResponse = await fetchHeroPositionImages();
        let imgs = heroPositionResponse.resources || [];
        
        // Sort images by their position tag
        if (imgs.length > 0) {
          imgs = imgs
            .map(img => ({ img, pos: getHeroPosition(img) }))
            .filter(({ pos }) => pos !== null)
            .sort((a, b) => (a.pos as number) - (b.pos as number))
            .map(({ img }) => img);
        }
        
        // If no position-tagged images, fall back to hero-gallery tag
        if (imgs.length === 0) {
          const heroGalleryResponse = await fetchHeroGalleryImages();
          imgs = heroGalleryResponse.resources || [];
        }
        
        // If still no images, fall back to hero folder
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
