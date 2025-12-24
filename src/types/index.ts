/**
 * Global Type Definitions
 * Centralized type definitions for better type safety and reusability
 */

import { LucideIcon } from 'lucide-react';

/**
 * Navigation item structure
 */
export interface NavigationItem {
  key: string;
  href: string;
}

/**
 * Service item with icon and image
 */
export interface ServiceItem {
  key: string;
  icon: React.ReactNode;
  image: string;
}

/**
 * Statistics/metrics item
 */
export interface StatItem {
  value: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Mouse position for parallax effects
 */
export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Language definition
 */
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

/**
 * GSAP element type for scroll animations
 */
export type GSAPElement = Element | string;

/**
 * Contact information
 */
export interface ContactInfo {
  phone: string;
  whatsapp: string;
}
