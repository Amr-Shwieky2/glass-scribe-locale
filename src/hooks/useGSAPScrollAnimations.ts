/**
 * useGSAPScrollAnimations Hook
 * Manages GSAP ScrollTrigger animations with lazy loading
 */

import { useEffect } from 'react';
import { SCROLL_TRIGGER_DEFAULTS } from '@/constants/animation';

/**
 * Hook to setup GSAP scroll-based animations
 * Lazy loads GSAP only when needed
 */
export const useGSAPScrollAnimations = () => {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Dynamically import GSAP to reduce initial bundle size
    const initAnimations = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // Reveal animations
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((elem) => {
          gsap.from(elem, {
            opacity: 0,
            y: 100,
            duration: 1,
            scrollTrigger: {
              trigger: elem,
              start: SCROLL_TRIGGER_DEFAULTS.start,
              end: SCROLL_TRIGGER_DEFAULTS.end,
              scrub: SCROLL_TRIGGER_DEFAULTS.scrub,
            },
          });
        });

        // Blur reveal animations
        gsap.utils.toArray<HTMLElement>('.blur-reveal').forEach((elem) => {
          gsap.from(elem, {
            filter: 'blur(20px)',
            scale: 0.95,
            opacity: 0,
            duration: 1.2,
            scrollTrigger: {
              trigger: elem,
              start: 'top 75%',
              end: 'top 25%',
              scrub: SCROLL_TRIGGER_DEFAULTS.scrub,
            },
          });
        });
      });

      cleanup = () => ctx.revert();
    };

    initAnimations();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);
};
