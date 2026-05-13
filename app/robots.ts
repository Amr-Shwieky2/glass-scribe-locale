import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/he/admin', '/en/admin', '/ar/admin', '/ru/admin', '/admin'],
    },
    sitemap: 'https://www.shwakiglassworks.com/sitemap.xml',
  };
}
