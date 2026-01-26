/**
 * Strapi Utility Helpers
 * Helper functions for working with Strapi data structures
 */

import type { StrapiImage } from './types';
import { getStrapiImageUrl } from './client';

function unwrapStrapiMedia(media: unknown): unknown {
  if (!media || typeof media !== 'object') return null;
  if ('data' in (media as Record<string, unknown>)) {
    return (media as { data: unknown }).data;
  }
  return media;
}

function getStrapiMediaUrl(media: unknown): string {
  const unwrapped = unwrapStrapiMedia(media);
  if (!unwrapped || typeof unwrapped !== 'object') return '';
  const obj = unwrapped as Record<string, unknown>;
  const url = (obj.url as string | undefined) ??
    ((obj.attributes as Record<string, unknown> | undefined)?.url as string | undefined);
  return url ? getStrapiImageUrl(url) : '';
}

function getStrapiMediaFormats(media: unknown): Record<string, unknown> | undefined {
  const unwrapped = unwrapStrapiMedia(media);
  if (!unwrapped || typeof unwrapped !== 'object') return undefined;
  const obj = unwrapped as Record<string, unknown>;
  return (obj.formats as Record<string, unknown> | undefined) ??
    ((obj.attributes as Record<string, unknown> | undefined)?.formats as Record<string, unknown> | undefined);
}

function getStrapiMediaMeta(media: unknown): {
  name?: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
} {
  const unwrapped = unwrapStrapiMedia(media);
  if (!unwrapped || typeof unwrapped !== 'object') return {};
  const obj = unwrapped as Record<string, unknown>;
  const attrs = obj.attributes as Record<string, unknown> | undefined;
  return {
    name: (obj.name as string | undefined) ?? (attrs?.name as string | undefined),
    alternativeText:
      (obj.alternativeText as string | null | undefined) ??
      (attrs?.alternativeText as string | null | undefined) ??
      null,
    width: (obj.width as number | undefined) ?? (attrs?.width as number | undefined),
    height: (obj.height as number | undefined) ?? (attrs?.height as number | undefined),
  };
}

/**
 * Get image URL from Strapi media field
 * Handles both single media and nested data structure
 */
export function getImageUrl(
  media: { data: StrapiImage } | StrapiImage | null | undefined
): string {
  return getStrapiMediaUrl(media);
}

/**
 * Get optimized image URL by format
 */
export function getImageFormat(
  media: { data: StrapiImage } | StrapiImage | null | undefined,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!media) return '';

  const formats = getStrapiMediaFormats(media);
  const selectedFormat = formats?.[format] as { url?: string } | undefined;
  if (selectedFormat?.url) return getStrapiImageUrl(selectedFormat.url);
  return getStrapiMediaUrl(media);
}

/**
 * Get image alt text from Strapi media
 */
export function getImageAlt(
  media: { data: StrapiImage } | StrapiImage | null | undefined,
  fallback: string = ''
): string {
  if (!media) return fallback;

  const meta = getStrapiMediaMeta(media);
  return meta.alternativeText || meta.name || fallback;
}

/**
 * Get gallery images from Strapi media field
 */
export function getGalleryImages(
  gallery: { data: StrapiImage[] } | StrapiImage[] | null | undefined
): StrapiImage[] {
  if (!gallery) return [];
  
  // Check if it's a wrapped data array
  if ('data' in gallery && Array.isArray(gallery.data)) {
    return gallery.data;
  }
  
  // Check if it's a direct array
  if (Array.isArray(gallery)) {
    return gallery;
  }
  
  return [];
}

/**
 * Get responsive image srcset for Strapi image
 */
export function getImageSrcSet(
  media: { data: StrapiImage } | StrapiImage | null | undefined
): string {
  if (!media) return '';

  const formats = getStrapiMediaFormats(media);
  const srcSet: string[] = [];
  
  // Add available formats to srcset
  const small = formats?.small as { url?: string; width?: number } | undefined;
  if (small?.url && small?.width) {
    srcSet.push(`${getStrapiImageUrl(small.url)} ${small.width}w`);
  }
  const medium = formats?.medium as { url?: string; width?: number } | undefined;
  if (medium?.url && medium?.width) {
    srcSet.push(`${getStrapiImageUrl(medium.url)} ${medium.width}w`);
  }
  const large = formats?.large as { url?: string; width?: number } | undefined;
  if (large?.url && large?.width) {
    srcSet.push(`${getStrapiImageUrl(large.url)} ${large.width}w`);
  }
  
  // Add original as fallback
  const url = getStrapiMediaUrl(media);
  const meta = getStrapiMediaMeta(media);
  if (url && meta.width) {
    srcSet.push(`${url} ${meta.width}w`);
  }
  
  return srcSet.join(', ');
}

/**
 * Get optimized image props for Next.js Image or similar
 */
export function getImageProps(
  media: { data: StrapiImage } | StrapiImage | null | undefined,
  fallbackAlt: string = ''
): {
  src: string;
  alt: string;
  width: number;
  height: number;
} | null {
  if (!media) return null;

  const src = getStrapiMediaUrl(media);
  if (!src) return null;

  const meta = getStrapiMediaMeta(media);
  if (!meta.width || !meta.height) return null;

  return {
    src,
    alt: meta.alternativeText || meta.name || fallbackAlt,
    width: meta.width,
    height: meta.height,
  };
}

/**
 * Extract plain text from Strapi rich text blocks
 */
export function extractPlainText(richText: unknown): string {
  if (!richText) return '';
  
  // If it's already a string, return it
  if (typeof richText === 'string') return richText;
  
  // If it's Strapi blocks format
  if (Array.isArray(richText)) {
    return richText
      .map((block: { type?: string; children?: Array<{ text?: string }> }) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children
            .map((child: { text?: string }) => child.text || '')
            .join('');
        }
        return '';
      })
      .join('\n');
  }
  
  return '';
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get excerpt from rich text
 */
export function getExcerpt(richText: unknown, maxLength: number = 150): string {
  const plainText = extractPlainText(richText);
  return truncateText(plainText, maxLength);
}
