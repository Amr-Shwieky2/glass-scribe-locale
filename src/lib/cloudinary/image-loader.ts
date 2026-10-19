/**
 * next/image loader (configured globally in next.config.mjs).
 *
 * Cloudinary URLs are resized by Cloudinary itself: the width requested by
 * next/image replaces the w_ (and proportionally the h_) of the URL's
 * transformation segment. Local /public files are served as-is.
 */
interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

const UPLOAD = '/image/upload/';

function isTransformSegment(segment: string): boolean {
  return /^([a-z]{1,3}_[^,/]+)(,[a-z]{1,3}_[^,/]+)*$/.test(segment) && !/^v\d+$/.test(segment);
}

export default function cloudinaryLoader({ src, width, quality }: LoaderArgs): string {
  const idx = src.indexOf(UPLOAD);
  if (!src.startsWith('https://res.cloudinary.com/') || idx === -1) {
    return src.startsWith('/') ? `${src}?w=${width}` : src;
  }

  const prefix = src.slice(0, idx + UPLOAD.length);
  const rest = src.slice(idx + UPLOAD.length);
  const [first, ...others] = rest.split('/');
  const q = quality ? `q_${quality}` : 'q_auto';

  if (!isTransformSegment(first)) {
    return `${prefix}${q},f_auto,c_limit,w_${width}/${rest}`;
  }

  const params = new Map(first.split(',').map((p) => [p.slice(0, p.indexOf('_')), p.slice(p.indexOf('_') + 1)] as const));
  const w = Number(params.get('w'));
  const h = Number(params.get('h'));
  if (w && h) params.set('h', String(Math.round((width * h) / w)));
  params.set('w', String(width));
  if (!params.has('c')) params.set('c', 'limit');
  if (quality) params.set('q', String(quality));

  const segment = [...params].map(([k, v]) => `${k}_${v}`).join(',');
  return `${prefix}${segment}/${others.join('/')}`;
}
