'use client';
/**
 * HeroGallery - Premium Cinematic Hero Section (Orchestrator)
 */
import React, { useRef, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import type { SupportedLocale } from '@/data';
import { useHeroImages, getHeroUrl } from '@/hooks/cloudinary';
import { useHeroTimeline } from '@/hooks/useHeroTimeline';
import { TEXT_BLOCKS } from './hero/heroConfig';
import AmbientMotif from './hero/AmbientMotif';
import HeroBackground from './hero/HeroBackground';
import DesktopGallery from './hero/DesktopGallery';
import MobileGallery from './hero/MobileGallery';
import HeroCTA from './hero/HeroCTA';
import ScrollIndicator from './hero/ScrollIndicator';

const HeroGallery: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const texts = TEXT_BLOCKS[locale] || TEXT_BLOCKS.en;
  const { images: heroImages } = useHeroImages();
  const { getFrameVisibility, getTextVisibility, getFrameDelay, getTextDelay, ctaVisible } = useHeroTimeline(isInView);

  const frames = useMemo(() => {
    // Use only Cloudinary images, no fallback to static images
    const cloud = heroImages.map((img, i) => ({ 
      id: i + 1, 
      image: getHeroUrl(img.public_id), 
      alt: img.context?.custom?.alt || `Glass work ${i + 1}` 
    }));
    return cloud.slice(0, 7);
  }, [heroImages]);

  const galleryProps = { frames, texts, getFrameVisibility, getTextVisibility, getFrameDelay, getTextDelay };

  return (
    <section ref={containerRef} className="hero-gallery relative min-h-screen overflow-hidden bg-brand-navy">
      <HeroBackground />
      <AmbientMotif />
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 min-h-screen flex flex-col">
        <DesktopGallery {...galleryProps} />
        <MobileGallery {...galleryProps} />
        <HeroCTA locale={locale} currentLanguage={currentLanguage} ctaVisible={ctaVisible} />
      </div>
      <ScrollIndicator visible={ctaVisible} />
    </section>
  );
};

export default HeroGallery;
