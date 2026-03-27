import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.shwakiglassworks.com';
const LANGUAGES = ['he', 'en', 'ar', 'ru'];
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const CORE_PAGES = ['', 'services', 'projects', 'about', 'contact', 'blog'];
const SERVICE_PAGES = ['shower-glass', 'glass-railings', 'mirrors', 'glass-partitions', 'storefront-glass'];
// SEO slug-based service detail pages (the actual URLs users visit)
const SEO_SERVICE_SLUGS = ['glass-shower-installation', 'glass-railing', 'glass-mirrors', 'shop-front-glass', 'glass-partitions'];
const LOCATION_PAGES = ['jerusalem', 'tel-aviv', 'haifa', 'beer-sheva', 'netanya'];
const BLOG_SLUGS = [
  'guide-to-choosing-glass-shower',
  'cost-of-glass-railing-installation',
  'tempered-vs-regular-glass',
  'tips-maintaining-glass-showers',
  'mirrors-in-interior-design'
];

const generateUrlEntry = (routePath, priority) => {
  let xml = '';
  LANGUAGES.forEach((lang) => {
    const canonicalUrl = `${DOMAIN}/${lang}${routePath ? '/' + routePath : ''}`;
    let hreflangLinks = '';

    LANGUAGES.forEach((altLang) => {
      hreflangLinks += `\n    <xhtml:link rel="alternate" hreflang="${altLang}" href="${DOMAIN}/${altLang}${routePath ? '/' + routePath : ''}"/>`;
    });
    // Add x-default pointing to Hebrew
    hreflangLinks += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}/he${routePath ? '/' + routePath : ''}"/>`;

    xml += `
  <url>
    <loc>${canonicalUrl}</loc>${hreflangLinks}
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });
  return xml;
};

const generateSitemap = () => {
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Core Pages (Priority 0.9 or 1.0)
  CORE_PAGES.forEach((page) => {
    sitemapXml += generateUrlEntry(page, page === '' ? '1.0' : '0.9');
  });

  // Service detail pages via /:lang/services/:serviceId (Priority 0.8)
  SERVICE_PAGES.forEach((service) => {
    sitemapXml += generateUrlEntry(`services/${service}`, '0.8');
  });

  // SEO slug service pages (the actual URLs reached from card links)
  SEO_SERVICE_SLUGS.forEach((slug) => {
    sitemapXml += generateUrlEntry(slug, '0.8');
  });

  // Location Pages (Priority 0.8)
  LOCATION_PAGES.forEach((location) => {
    sitemapXml += generateUrlEntry(location, '0.8');
  });

  // Blog Pages (Priority 0.7)
  BLOG_SLUGS.forEach((slug) => {
    sitemapXml += generateUrlEntry(`blog/${slug}`, '0.7');
  });

  sitemapXml += `\n</urlset>`;

  const outPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outPath, sitemapXml);
  console.log("Sitemap successfully generated at " + outPath);
};

generateSitemap();
