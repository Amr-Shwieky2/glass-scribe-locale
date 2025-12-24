/**
 * Animation Configuration Constants
 * Centralized animation settings for consistent motion design
 */

import { config as springConfig } from '@react-spring/web';

/**
 * React Spring animation configurations
 */
export const SPRING_CONFIGS = {
  default: springConfig.default,
  gentle: springConfig.gentle,
  wobbly: springConfig.wobbly,
  stiff: springConfig.stiff,
  slow: springConfig.slow,
  molasses: springConfig.molasses,
  // Custom smooth config
  smooth: { tension: 280, friction: 60 },
} as const;

/**
 * GSAP scroll trigger settings
 */
export const SCROLL_TRIGGER_DEFAULTS = {
  start: 'top 80%',
  end: 'top 20%',
  scrub: 1,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  slower: 700,
  slowest: 1000,
} as const;

/**
 * Scroll detection threshold
 */
export const SCROLL_THRESHOLD = 20;
