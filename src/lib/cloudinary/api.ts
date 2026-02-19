/**
 * Client-side API functions for fetching Cloudinary images.
 */

import type { ServiceCategory } from './config';
import type { CloudinaryResponse } from './types';

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

export async function fetchHeroImages(): Promise<CloudinaryResponse> {
  return fetchImagesByCategory('hero', { limit: 10 });
}

export async function fetchAllImages(): Promise<CloudinaryResponse> {
  const response = await fetch('/api/cloudinary/images?all=true');
  if (!response.ok) {
    throw new Error(`Failed to fetch all images: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchServiceCardImages(): Promise<CloudinaryResponse> {
  const params = new URLSearchParams();
  params.set('tag', 'service-card');
  params.set('all', 'true');

  const response = await fetch(`/api/cloudinary/images?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch service card images: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchHeroGalleryImages(): Promise<CloudinaryResponse> {
  const params = new URLSearchParams();
  params.set('tag', 'hero-gallery');
  params.set('all', 'true');
  params.set('limit', '10');

  const response = await fetch(`/api/cloudinary/images?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch hero gallery images: ${response.statusText}`);
  }
  return response.json();
}
