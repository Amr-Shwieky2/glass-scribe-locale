/**
 * Hero Gallery Configuration
 * 
 * Contains all static data, text blocks, timing config,
 * and Framer Motion animation variants for the hero section.
 */

import type { Variants } from 'framer-motion';

// =============================================================================
// FALLBACK GALLERY FRAMES
// =============================================================================

export const FALLBACK_FRAMES: { id: number; image: string; alt: string }[] = [];

// =============================================================================
// TEXT BLOCKS — the narrative
// =============================================================================

export const TEXT_BLOCKS = {
  en: [
    { main: 'Crafted', accent: 'with precision' },
    { main: 'Every space', accent: 'transformed' },
    { main: 'Light,', accent: 'elevated' },
    { main: 'Clarity', accent: 'in every detail' },
    { main: 'Where vision', accent: 'meets craft' },
    { main: 'Premium', accent: 'glass solutions' },
  ],
  he: [
    { main: 'מעוצב', accent: 'בדיוק' },
    { main: 'כל מרחב', accent: 'משתנה' },
    { main: 'אור,', accent: 'מורם' },
    { main: 'בהירות', accent: 'בכל פרט' },
    { main: 'איפה חזון', accent: 'פוגש אומנות' },
    { main: 'פתרונות', accent: 'זכוכית פרימיום' },
  ],
  ar: [
    { main: 'مصنوع', accent: 'بدقة' },
    { main: 'كل مساحة', accent: 'تتحول' },
    { main: 'ضوء،', accent: 'مرتفع' },
    { main: 'وضوح', accent: 'في كل تفصيل' },
    { main: 'حيث الرؤية', accent: 'تلتقي بالحرفة' },
    { main: 'حلول', accent: 'زجاجية متميزة' },
  ],
  ru: [
    { main: 'Создано', accent: 'с точностью' },
    { main: 'Каждое пространство', accent: 'преображено' },
    { main: 'Свет,', accent: 'возвышенный' },
    { main: 'Ясность', accent: 'в каждой детали' },
    { main: 'Где видение', accent: 'встречает мастерство' },
    { main: 'Премиум', accent: 'стеклянные решения' },
  ],
};

// =============================================================================
// TIMING
// =============================================================================

export const TIMING = {
  initialDelay: 0.15,
  frameDuration: 0.6,
  textDuration: 0.5,
  staggerDelay: 0.35,
  motifDuration: 20,
};

// Custom easing — "luxury" feel (cubic bezier)
export const luxuryEase = [0.25, 0.1, 0.25, 1] as const;

// =============================================================================
// ANIMATION VARIANTS
// =============================================================================

export const frameVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: TIMING.frameDuration,
      ease: luxuryEase as unknown as [number, number, number, number],
    },
  },
};

export const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: TIMING.textDuration,
      ease: luxuryEase as unknown as [number, number, number, number],
    },
  },
};

export const ctaVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase as unknown as [number, number, number, number],
    },
  },
};
