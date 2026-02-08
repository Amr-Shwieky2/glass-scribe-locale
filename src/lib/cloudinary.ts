/**
 * @fileoverview Cloudinary Configuration & Utilities
 * @description Handles all Cloudinary image operations for Shwaki Brothers Glassworks.
 * 
 * ARCHITECTURE:
 * - Public visitors: Read-only access to optimized images
 * - Admin: Full CRUD operations via serverless API
 * - Images organized by service category folders
 * 
 * CATEGORIES:
 * - shower-enclosures, glass-railings, mirrors, storefronts
 * - partitions, lobbies, backsplashes, shelves, glass-doors, hero
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dc1q8upxt',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'shwaki_glass_unsigned',
  baseFolder: 'shwaki-glassworks',
} as const;

// =============================================================================
// SERVICE CATEGORIES
// =============================================================================

export const SERVICE_CATEGORIES = [
  'shower-enclosures',
  'glass-railings',
  'mirrors',
  'storefronts',
  'partitions',
  'lobbies',
  'backsplashes',
  'shelves',
  'glass-doors',
  'hero',
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

// =============================================================================
// TYPES
// =============================================================================

export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  tags: string[];
  context?: {
    custom?: {
      alt?: string;
      caption?: string;
    };
  };
}

export interface CloudinaryResponse {
  resources: CloudinaryImage[];
  next_cursor?: string;
  total_count?: number;
}

// =============================================================================
// URL TRANSFORMATIONS
// =============================================================================

/**
 * Builds optimized Cloudinary URL with transformations
 */
export function buildImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'thumb';
    gravity?: 'auto' | 'face' | 'center';
    blur?: number;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
    gravity = 'auto',
    blur,
  } = options;

  const transformations: string[] = [];

  // Quality and format
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  // Dimensions
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);

  // Crop and gravity
  if (width || height) {
    transformations.push(`c_${crop}`);
    transformations.push(`g_${gravity}`);
  }

  // Effects
  if (blur) transformations.push(`e_blur:${blur}`);

  const transformString = transformations.join(',');
  const { cloudName } = CLOUDINARY_CONFIG;

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

/**
 * Get optimized thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size = 300): string {
  return buildImageUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    format: 'auto',
  });
}

/**
 * Get full-size optimized URL for gallery view
 */
export function getGalleryUrl(publicId: string): string {
  return buildImageUrl(publicId, {
    width: 1200,
    quality: 'auto',
    format: 'auto',
    crop: 'fit',
  });
}

/**
 * Get hero-sized image URL
 */
export function getHeroUrl(publicId: string): string {
  return buildImageUrl(publicId, {
    width: 1920,
    height: 1080,
    quality: 'auto',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  });
}

/**
 * Get blurred placeholder URL for lazy loading
 */
export function getPlaceholderUrl(publicId: string): string {
  return buildImageUrl(publicId, {
    width: 50,
    quality: 30,
    format: 'webp',
    blur: 1000,
  });
}

// =============================================================================
// API FETCH FUNCTIONS (Client-side)
// =============================================================================

/**
 * Fetch images by category from our serverless API
 */
export async function fetchImagesByCategory(
  category: ServiceCategory,
  options: { limit?: number; nextCursor?: string } = {}
): Promise<CloudinaryResponse> {
  const params = new URLSearchParams();
  params.set('category', category);
  if (options.limit) params.set('limit', options.limit.toString());
  if (options.nextCursor) params.set('cursor', options.nextCursor);

  const response = await fetch(`/api/cloudinary/images?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch featured images (tagged with 'featured')
 */
export async function fetchFeaturedImages(
  category?: ServiceCategory
): Promise<CloudinaryResponse> {
  const params = new URLSearchParams();
  params.set('featured', 'true');
  if (category) params.set('category', category);

  const response = await fetch(`/api/cloudinary/images?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch featured images: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch hero images for homepage
 */
export async function fetchHeroImages(): Promise<CloudinaryResponse> {
  return fetchImagesByCategory('hero', { limit: 10 });
}

/**
 * Fetch all images across all categories
 */
export async function fetchAllImages(): Promise<CloudinaryResponse> {
  const response = await fetch('/api/cloudinary/images?all=true');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch all images: ${response.statusText}`);
  }

  return response.json();
}

// =============================================================================
// ADMIN API FUNCTIONS
// =============================================================================

/**
 * Delete an image (admin only)
 */
export async function deleteImage(publicId: string, adminToken: string): Promise<void> {
  const response = await fetch('/api/cloudinary/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ publicId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete image');
  }
}

/**
 * Toggle featured tag on an image (admin only)
 */
export async function toggleFeatured(
  publicId: string,
  featured: boolean,
  adminToken: string
): Promise<void> {
  const response = await fetch('/api/cloudinary/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      publicId,
      tag: 'featured',
      action: featured ? 'add' : 'remove',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update image');
  }
}

// =============================================================================
// UPLOAD WIDGET CONFIGURATION
// =============================================================================

/**
 * Get Cloudinary Upload Widget configuration
 */
export function getUploadWidgetConfig(category: ServiceCategory) {
  return {
    cloudName: CLOUDINARY_CONFIG.cloudName,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    folder: `${CLOUDINARY_CONFIG.baseFolder}/${category}`,
    tags: [category],
    sources: ['local', 'url', 'camera'],
    multiple: true,
    maxFiles: 20,
    maxImageFileSize: 10000000, // 10MB
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    cropping: false,
    showAdvancedOptions: false,
    showPoweredBy: false,
    styles: {
      palette: {
        window: '#FFFFFF',
        windowBorder: '#0F2A44',
        tabIcon: '#C9A24D',
        menuIcons: '#0F2A44',
        textDark: '#0F2A44',
        textLight: '#FFFFFF',
        link: '#C9A24D',
        action: '#C9A24D',
        inactiveTabIcon: '#0F2A44',
        error: '#FF4444',
        inProgress: '#C9A24D',
        complete: '#20B832',
        sourceBg: '#F2F2F2',
      },
      fonts: {
        default: null,
        "'Inter', sans-serif": {
          url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
          active: true,
        },
      },
    },
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract category from public_id
 */
export function getCategoryFromPublicId(publicId: string): ServiceCategory | null {
  for (const category of SERVICE_CATEGORIES) {
    if (publicId.includes(`/${category}/`)) {
      return category;
    }
  }
  return null;
}

/**
 * Format category name for display
 */
export function formatCategoryName(category: ServiceCategory): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if image is featured
 */
export function isFeatured(image: CloudinaryImage): boolean {
  return image.tags?.includes('featured') ?? false;
}
