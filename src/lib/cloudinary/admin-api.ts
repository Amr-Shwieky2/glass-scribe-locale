/**
 * Admin-only Cloudinary API functions (delete, tag).
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
