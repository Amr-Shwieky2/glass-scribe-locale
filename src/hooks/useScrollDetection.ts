/**
 * useScrollDetection Hook
 * Detects when user has scrolled past a threshold
 */

import { useState, useEffect } from 'react';
import { SCROLL_THRESHOLD } from '@/constants/animation';

interface UseScrollDetectionOptions {
  threshold?: number;
}

/**
 * Hook to detect scroll position
 * @param options - Configuration options
 * @returns boolean indicating if scrolled past threshold
 */
export const useScrollDetection = (
  options: UseScrollDetectionOptions = {}
): boolean => {
  const { threshold = SCROLL_THRESHOLD } = options;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    // Add event listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return scrolled;
};
