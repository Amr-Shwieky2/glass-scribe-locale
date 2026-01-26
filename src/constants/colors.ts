/**
 * Shwaki Glassworks Color System
 * Centralized color configuration for easy maintenance
 */

export const BRAND_COLORS = {
  // Primary brand colors from logo
  white: '#FFFFFF',
  lightGray: '#F2F2F2',
  navyBlue: '#2B5A8E', // Logo S color
  lightBlue: '#5B9FD8', // Logo glass design
  gold: '#D4A647', // Logo B & sparkle color
  charcoal: '#2B2B2B', // Text color
  
  // Derived colors for better UX
  navyBlueLight: '#3D6FA5',
  lightBluePale: '#A8CEEC',
  goldLight: '#E4BC6F',
  
  // Functional colors
  border: '#E5E5E5',
  textPrimary: '#2B2B2B',
  textSecondary: '#666666',
  textMuted: '#999999',
  
  // Background colors
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F2F2F2',
  
  // State colors (keeping minimal, professional)
  success: '#4A7C59',
  error: '#B04A4A',
  warning: '#B08D57', // Using gold for warnings
} as const;

/**
 * CSS class mappings for easy use in components
 */
export const COLOR_CLASSES = {
  // Text colors
  text: {
    primary: 'text-foreground', // Uses CSS variable
    secondary: 'text-muted-foreground',
    gold: 'text-accent',
    white: 'text-white',
  },
  
  // Background colors
  bg: {
    white: 'bg-white',
    lightGray: 'bg-secondary',
    charcoal: 'bg-primary',
    gold: 'bg-accent',
  },
  
  // Border colors
  border: {
    default: 'border-border',
    gold: 'border-accent',
  },
  
  // Button variants
  button: {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
    gold: 'bg-accent text-accent-foreground hover:bg-accent/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground',
  },
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;
export type ColorClass = typeof COLOR_CLASSES;
