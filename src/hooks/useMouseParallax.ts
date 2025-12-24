/**
 * useMouseParallax Hook
 * Tracks mouse position for parallax effects
 */

import { useState, useCallback } from 'react';
import { MousePosition } from '@/types';

interface UseMouseParallaxOptions {
  intensity?: number;
}

/**
 * Hook to track mouse position for parallax effects
 * @param options - Configuration options
 * @returns Mouse position and handler function
 */
export const useMouseParallax = (options: UseMouseParallaxOptions = {}) => {
  const { intensity = 20 } = options;
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * intensity;
      const y = (clientY / window.innerHeight - 0.5) * intensity;
      setMousePosition({ x, y });
    },
    [intensity]
  );

  return { mousePosition, handleMouseMove };
};
