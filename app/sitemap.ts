import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/data';
import { SERVICE_SEO_PAGES } from '@/data/service-seo-content';
import { LOCATION_SLUGS } from '@/data/locations';
import { CONTENT_LAST_MODIFIED, languageAlternates, pageUrl } from '@/data/seo';
import { LOCALES } from '@/lib/i18n';

type Entry = MetadataRoute.Sitemap[number];

/** One entry per locale, each carrying the full hreflang set (+ x-default). */
function localized(path: string, lastModified: string, changeFrequency: Entry['changeFrequency'], priority: number): MetadataRoute.Sitemap {
  const languages = languageAlternates(path);
  return LOCALES.map((lang) => ({
    url: pageUrl(lang, path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['services', 'projects', 'about', 'contact', 'blog', 'contractors', 'privacy', 'terms'] as const;

  return [
    ...localized('', CONTENT_LAST_MODIFIED.home, 'weekly', 1.0),
    ...staticPages.flatMap((page) => localized(`/${page}`, CONTENT_LAST_MODIFIED[page], 'weekly', 0.8)),
    // Service SEO landing pages (dedicated content — pretty keyword slugs)
    ...SERVICE_SEO_PAGES.flatMap((service) => localized(`/${service.slug}`, CONTENT_LAST_MODIFIED.servicePages, 'monthly', 0.9)),
    // City landing pages that actually exist
    ...LOCATION_SLUGS.flatMap((slug) => localized(`/${slug}`, CONTENT_LAST_MODIFIED.locationPages, 'monthly', 0.9)),
    ...BLOG_POSTS.flatMap((post) => localized(`/blog/${post.slug}`, post.date, 'monthly', 0.7)),
  ];
}
