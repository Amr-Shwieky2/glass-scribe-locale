import { MetadataRoute } from 'next';
import { LOCATION_SEO_LINKS, BUSINESS_INFO, BLOG_POSTS } from '@/data';
import { SERVICE_SEO_PAGES } from '@/data/service-seo-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.shwakiglassworks.com';
  const supportedLanguages = ['he', 'en', 'ar', 'ru'];
  const now = new Date();

  const localesObj = supportedLanguages.reduce((acc, code) => {
    acc[code] = `${baseUrl}/${code}`;
    return acc;
  }, {} as Record<string, string>);

  const routes: MetadataRoute.Sitemap = [];

  // Home Page
  for (const lang of supportedLanguages) {
    const alternates: Record<string, string> = {
      'x-default': `${baseUrl}/he`,
    };
    for (const code of supportedLanguages) {
      alternates[code] = `${baseUrl}/${code}`;
    }

    routes.push({
      url: `${baseUrl}/${lang}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: alternates,
      },
    });
  }

  // Base Pages
  const staticPages = ['services', 'projects', 'about', 'contact', 'blog', 'contractors', 'privacy', 'terms'];
  for (const page of staticPages) {
    for (const lang of supportedLanguages) {
      const alternates: Record<string, string> = {};
      for (const code of supportedLanguages) {
        alternates[code] = `${baseUrl}/${code}/${page}`;
      }

      routes.push({
        url: `${baseUrl}/${lang}/${page}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // Service SEO landing pages (dedicated content — pretty keyword slugs)
  for (const service of SERVICE_SEO_PAGES) {
    for (const lang of supportedLanguages) {
      const alternates: Record<string, string> = {};
      for (const code of supportedLanguages) {
        alternates[code] = `${baseUrl}/${code}/${service.slug}`;
      }

      routes.push({
        url: `${baseUrl}/${lang}/${service.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // Locations
  for (const location of LOCATION_SEO_LINKS) {
    for (const lang of supportedLanguages) {
      const alternates: Record<string, string> = {};
      for (const code of supportedLanguages) {
        alternates[code] = `${baseUrl}/${code}/${location.slug}`;
      }

      routes.push({
        url: `${baseUrl}/${lang}/${location.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // Blog Posts
  for (const post of BLOG_POSTS) {
    for (const lang of supportedLanguages) {
      const alternates: Record<string, string> = {};
      for (const code of supportedLanguages) {
        alternates[code] = `${baseUrl}/${code}/blog/${post.slug}`;
      }

      routes.push({
        url: `${baseUrl}/${lang}/blog/${post.slug}`,
        lastModified: post.date,
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return routes;
}
