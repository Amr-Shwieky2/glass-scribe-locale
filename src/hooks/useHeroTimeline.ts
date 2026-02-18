import { useEffect, useState } from 'react';
import { TIMING } from '@/components/hero/heroConfig';

export function useHeroTimeline(isInView: boolean) {
  const [visibleElements, setVisibleElements] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const totalElements = 13;
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisibleElements(current);
      if (current >= totalElements) clearInterval(interval);
    }, TIMING.staggerDelay * 1000);
    return () => clearInterval(interval);
  }, [isInView]);

  const getFrameVisibility = (i: number) => visibleElements > i * 2;
  const getTextVisibility = (i: number) => visibleElements > i * 2 + 1;
  const getFrameDelay = () => TIMING.initialDelay;
  const getTextDelay = () => TIMING.initialDelay + 0.1;
  const ctaVisible = visibleElements >= 10;

  return { getFrameVisibility, getTextVisibility, getFrameDelay, getTextDelay, ctaVisible };
}
