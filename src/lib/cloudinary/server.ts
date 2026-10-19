/**
 * Server-side Cloudinary access with a shared cache.
 *
 * Every visitor used to trigger live Cloudinary Search API calls from the
 * browser, which can exhaust the hourly Admin API quota and make images vanish.
 * Now pages fetch on the server through `unstable_cache` (1h, tag
 * CLOUDINARY_CACHE_TAG) and the admin routes call `revalidateTag()` after any
 * upload/delete/tag change so the site updates immediately.
 *
 * Never import this from a client component (it reads the API secret).
 */
import { v2 as cloudinary } from 'cloudinary';
import { revalidateTag, unstable_cache } from 'next/cache';
import { PROJECT_CATEGORIES } from '@/data/project-categories';
import { SERVICES } from '@/data/services';
import type { CloudinaryImage } from './types';

export const CLOUDINARY_CACHE_TAG = 'cloudinary-images';
export const CLOUDINARY_BASE_FOLDER = process.env.CLOUDINARY_BASE_FOLDER || 'shwaki-glassworks';
const REVALIDATE_SECONDS = 3600;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function isCloudinaryConfigured(): boolean {
  return !!(
    (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME) &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// =============================================================================
// INPUT WHITELISTS — nothing user-supplied reaches a search expression unchecked
// =============================================================================

/** Cloudinary sub-folders that may be queried (project categories + hero). */
export const ALLOWED_CATEGORY_FOLDERS: ReadonlySet<string> = new Set([
  ...PROJECT_CATEGORIES.map((c) => c.cloudinaryFolder),
  'hero',
]);

const SERVICE_IDS = new Set(SERVICES.map((s) => s.id));

/** featured, hero-gallery, service-card, hero-1..hero-7, service-card-<serviceId>. */
export function isAllowedTag(tag: string): boolean {
  if (tag === 'featured' || tag === 'hero-gallery' || tag === 'service-card') return true;
  if (/^hero-[1-7]$/.test(tag)) return true;
  const m = /^service-card-([a-z0-9-]+)$/.exec(tag);
  return !!m && SERVICE_IDS.has(m[1]);
}

/** Cloudinary pagination cursors are opaque base64-ish tokens. */
export function isValidCursor(cursor: string): boolean {
  return cursor.length <= 512 && /^[A-Za-z0-9+/=_-]+$/.test(cursor);
}

/** Admin mutations may only touch assets inside our own folder. */
export function isOwnPublicId(publicId: unknown): publicId is string {
  return (
    typeof publicId === 'string' &&
    publicId.length <= 255 &&
    publicId.startsWith(`${CLOUDINARY_BASE_FOLDER}/`) &&
    !publicId.includes('..') &&
    /^[A-Za-z0-9_\-/.]+$/.test(publicId)
  );
}

// =============================================================================
// SEARCH
// =============================================================================

export type ImageQuery =
  | { kind: 'all' }
  | { kind: 'category'; folder: string; featured?: boolean }
  | { kind: 'featured' }
  | { kind: 'tag'; tag: string }
  | { kind: 'heroPositions' }
  | { kind: 'serviceCards' };

/** Builds the search expression from an already-validated query. */
export function buildExpression(query: ImageQuery): string {
  const base = `public_id:${CLOUDINARY_BASE_FOLDER}/*`;
  switch (query.kind) {
    case 'heroPositions':
      return `${base} AND (${[1, 2, 3, 4, 5, 6, 7].map((n) => `tags=hero-${n}`).join(' OR ')})`;
    case 'serviceCards':
      return `${base} AND tags:service-card-*`;
    case 'tag':
      return `${base} AND tags=${query.tag}`;
    case 'category':
      return `public_id:${CLOUDINARY_BASE_FOLDER}/${query.folder}/*${query.featured ? ' AND tags=featured' : ''}`;
    case 'featured':
      return `${base} AND tags=featured`;
    default:
      return base;
  }
}

interface SearchPage {
  resources: CloudinaryImage[];
  next_cursor?: string;
  total_count?: number;
}

/** Keeps only the fields the site renders — smaller cache entries and RSC payloads. */
function slim(resource: Record<string, unknown>): CloudinaryImage {
  const context = resource.context as CloudinaryImage['context'] | undefined;
  return {
    public_id: String(resource.public_id),
    secure_url: String(resource.secure_url),
    width: Number(resource.width) || 0,
    height: Number(resource.height) || 0,
    format: String(resource.format ?? ''),
    created_at: String(resource.created_at ?? ''),
    tags: Array.isArray(resource.tags) ? (resource.tags as string[]) : [],
    ...(context?.custom ? { context: { custom: { alt: context.custom.alt, caption: context.custom.caption } } } : {}),
  };
}

export async function searchImagesUncached(query: ImageQuery, limit = 50, cursor?: string): Promise<SearchPage> {
  if (!isCloudinaryConfigured()) return { resources: [] };

  let search = cloudinary.search
    .expression(buildExpression(query))
    .sort_by('created_at', 'desc')
    .max_results(Math.min(Math.max(limit, 1), 100))
    .with_field('tags')
    .with_field('context');
  if (cursor) search = search.next_cursor(cursor);

  const result = await search.execute();
  return {
    resources: ((result.resources ?? []) as Record<string, unknown>[]).map(slim),
    next_cursor: result.next_cursor,
    total_count: result.total_count,
  };
}

/** Cached search (1h, invalidated by revalidateTag(CLOUDINARY_CACHE_TAG)). Never throws. */
export async function searchImages(query: ImageQuery, limit = 50, cursor?: string): Promise<SearchPage> {
  const cached = unstable_cache(
    () => searchImagesUncached(query, limit, cursor),
    ['cloudinary-search', JSON.stringify(query), String(limit), cursor ?? ''],
    { revalidate: REVALIDATE_SECONDS, tags: [CLOUDINARY_CACHE_TAG] }
  );
  try {
    return await cached();
  } catch (err) {
    console.error('[cloudinary] search failed', err);
    return { resources: [] };
  }
}

// =============================================================================
// PAGE-LEVEL HELPERS
// =============================================================================

export async function getImagesByFolder(folder: string | undefined, limit = 50): Promise<CloudinaryImage[]> {
  if (folder && !ALLOWED_CATEGORY_FOLDERS.has(folder)) return [];
  const query: ImageQuery = folder ? { kind: 'category', folder } : { kind: 'all' };
  return (await searchImages(query, limit)).resources;
}

const heroPosition = (img: CloudinaryImage): number | null => {
  const tag = img.tags?.find((t) => /^hero-[1-7]$/.test(t));
  return tag ? parseInt(tag.split('-')[1], 10) : null;
};

/** Hero images ordered by hero-N tag, falling back to hero-gallery tag, then the hero folder. */
export async function getHeroImages(): Promise<CloudinaryImage[]> {
  const positioned = (await searchImages({ kind: 'heroPositions' }, 50)).resources
    .map((img) => ({ img, pos: heroPosition(img) }))
    .filter((x): x is { img: CloudinaryImage; pos: number } => x.pos !== null)
    .sort((a, b) => a.pos - b.pos)
    .map((x) => x.img);
  if (positioned.length > 0) return positioned;

  const gallery = (await searchImages({ kind: 'tag', tag: 'hero-gallery' }, 10)).resources;
  if (gallery.length > 0) return gallery;

  return getImagesByFolder('hero', 10);
}

const FOLDER_TO_SERVICE_ID: Record<string, string> = {
  'shower-enclosures': 'shower-glass',
  'glass-railings': 'glass-railings',
  mirrors: 'mirrors',
  partitions: 'glass-partitions',
  storefronts: 'storefront-glass',
  backsplashes: 'backsplashes',
  'glass-doors': 'glass-doors',
  shelves: 'shelves',
};

/**
 * serviceId → public_id of the card image: explicit service-card-{id} tag first,
 * then the legacy `service-card` tag, then (optionally) the newest image in the
 * service's folder.
 */
export async function getServiceCardImageIds({ folderFallback = false } = {}): Promise<Record<string, string>> {
  const map: Record<string, string> = {};

  for (const img of (await searchImages({ kind: 'serviceCards' }, 100)).resources) {
    const tag = img.tags.find((t) => t.startsWith('service-card-'));
    const id = tag?.slice('service-card-'.length);
    if (id && !map[id]) map[id] = img.public_id;
  }

  const legacy = (await searchImages({ kind: 'tag', tag: 'service-card' }, 100)).resources;
  const all = folderFallback ? (await searchImages({ kind: 'all' }, 100)).resources : [];
  for (const img of [...legacy, ...all]) {
    const folder = img.public_id.split('/')[1];
    const id = folder ? FOLDER_TO_SERVICE_ID[folder] : undefined;
    if (id && !map[id]) map[id] = img.public_id;
  }

  return map;
}

/** Every gallery image (paginated, up to `max`), newest first. Cached per page. */
export async function getAllImages(max = 500): Promise<CloudinaryImage[]> {
  const out: CloudinaryImage[] = [];
  let cursor: string | undefined;
  do {
    const page = await searchImages({ kind: 'all' }, 100, cursor);
    out.push(...page.resources);
    cursor = page.next_cursor;
  } while (cursor && out.length < max);
  return out.slice(0, max);
}

/** Call after any admin change (upload/delete/tag) so cached pages refresh on the next request. */
export function revalidateImages(): void {
  revalidateTag(CLOUDINARY_CACHE_TAG, { expire: 0 });
}
