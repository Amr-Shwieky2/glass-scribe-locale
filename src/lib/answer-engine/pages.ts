/**
 * Titles of our pages for the links under an answer (paths without the
 * language prefix, as stored in the knowledge base).
 */
import { BLOG_POSTS } from '@/data/blog-posts';
import { LOCATIONS, LOCATION_SLUGS } from '@/data/locations';
import { NAVIGATION } from '@/data/navigation';
import { SERVICE_SEO_PAGES } from '@/data/service-seo-content';
import type { SupportedLocale } from '@/data/types';
import type { ReplyLink } from '@/lib/chat-protocol';

const CONTRACTORS = { he: 'קבלנים ואדריכלים', en: 'Contractors & architects', ar: 'المقاولون والمعماريون', ru: 'Подрядчикам и архитекторам' };

function pageTitle(path: string, lang: SupportedLocale): string | null {
  const nav = NAVIGATION.items.find((i) => i.href === path);
  if (nav) return nav.label[lang];
  if (path === '/contractors') return CONTRACTORS[lang];
  const service = SERVICE_SEO_PAGES.find((p) => `/${p.slug}` === path);
  if (service) return service.heroTitle[lang];
  const post = BLOG_POSTS.find((p) => `/blog/${p.slug}` === path);
  if (post) return post.title[lang];
  const city = LOCATION_SLUGS.find((s) => `/${s}` === path);
  if (city) return LOCATIONS[city].heroTitle[lang];
  return null;
}

/** Localized links for knowledge base paths (unknown paths are dropped). */
export function pageLinks(paths: string[], lang: SupportedLocale): ReplyLink[] {
  return paths.flatMap((path) => {
    const title = pageTitle(path, lang);
    return title ? [{ title, url: path === '/' ? `/${lang}` : `/${lang}${path}` }] : [];
  });
}
