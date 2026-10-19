/**
 * Admin-only Cloudinary API functions (delete, tag).
 * Authenticated by the httpOnly admin session cookie (sent automatically on
 * same-origin requests) — no token is held in JavaScript.
 */

async function adminPost(url: string, body: unknown, fallbackError: string): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || fallbackError);
  }
}

/** Tell the server new uploads exist so cached pages refresh immediately. */
export async function notifyImagesChanged(): Promise<void> {
  await adminPost('/api/cloudinary/revalidate', {}, 'Failed to refresh site cache');
}

export async function deleteImage(publicId: string): Promise<void> {
  await adminPost('/api/cloudinary/delete', { publicId }, 'Failed to delete image');
}

export async function toggleFeatured(
  publicId: string,
  featured: boolean
): Promise<void> {
  await adminPost('/api/cloudinary/tag', {
    publicId,
    tag: 'featured',
    action: featured ? 'add' : 'remove',
  }, 'Failed to update image');
}

export async function toggleServiceCard(
  publicId: string,
  isServiceCard: boolean
): Promise<void> {
  await adminPost('/api/cloudinary/tag', {
    publicId,
    tag: 'service-card',
    action: isServiceCard ? 'add' : 'remove',
  }, 'Failed to update service card');
}

export async function toggleHeroImage(
  publicId: string,
  isHeroImage: boolean
): Promise<void> {
  await adminPost('/api/cloudinary/tag', {
    publicId,
    tag: 'hero-gallery',
    action: isHeroImage ? 'add' : 'remove',
  }, 'Failed to update hero image');
}

// =============================================================================
// HERO POSITION MANAGEMENT (hero-1, hero-2, ..., hero-7)
// =============================================================================

export async function setHeroPosition(
  publicId: string,
  position: number
): Promise<void> {
  if (position < 1 || position > 7) {
    throw new Error('Hero position must be between 1 and 7');
  }

  await adminPost('/api/cloudinary/tag', {
    publicId,
    tag: `hero-${position}`,
    action: 'add',
  }, 'Failed to set hero position');
}

export async function removeHeroPosition(
  publicId: string,
  position: number
): Promise<void> {
  await adminPost('/api/cloudinary/tag', {
    publicId,
    tag: `hero-${position}`,
    action: 'remove',
  }, 'Failed to remove hero position');
}

// =============================================================================
// SERVICE CARD IMAGE MANAGEMENT (service-card-{serviceId})
// =============================================================================

export async function setServiceCardImage(
  publicId: string,
  serviceId: string
): Promise<void> {
  await adminPost('/api/cloudinary/tag', {
    publicId,
    tag: `service-card-${serviceId}`,
    action: 'add',
  }, 'Failed to set service card image');
}

export async function removeServiceCardImage(
  publicId: string,
  serviceId: string
): Promise<void> {
  await adminPost('/api/cloudinary/tag', {
    publicId,
    tag: `service-card-${serviceId}`,
    action: 'remove',
  }, 'Failed to remove service card image');
}
