/**
 * Strapi CMS Client
 * Handles all API communication with Strapi backend
 */

import type { StrapiImage } from './types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN || '';

export class StrapiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Main fetch wrapper for Strapi API
 */
export async function strapiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  const url = new URL(`/api${endpoint}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new StrapiError(
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof StrapiError) {
      throw error;
    }
    throw new StrapiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      error
    );
  }
}

/**
 * Get full image URL
 */
export function getStrapiImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}

/**
 * Get optimized image URL by format
 */
export function getStrapiImageFormat(
  image: StrapiImage | { data: StrapiImage } | null | undefined,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!image) return '';

  const unwrapped: unknown =
    typeof image === 'object' && image && 'data' in (image as Record<string, unknown>)
      ? (image as { data: unknown }).data
      : image;

  if (!unwrapped || typeof unwrapped !== 'object') return '';
  const img = unwrapped as Record<string, unknown>;

  const url = (img.url as string | undefined) ??
    ((img.attributes as Record<string, unknown> | undefined)?.url as string | undefined);

  const formats = (img.formats as Record<string, unknown> | undefined) ??
    ((img.attributes as Record<string, unknown> | undefined)?.formats as Record<string, unknown> | undefined);

  const selectedFormat = formats?.[format] as { url?: string } | undefined;
  if (selectedFormat?.url) return getStrapiImageUrl(selectedFormat.url);

  return url ? getStrapiImageUrl(url) : '';
}

/**
 * Check if Strapi is available
 */
export async function checkStrapiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${STRAPI_URL}/api`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
