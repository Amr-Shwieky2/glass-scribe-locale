import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://www.shwakiglass.co.il';
const LANGUAGES = ['he', 'en', 'ar', 'ru'];

const CORE_PAGES = ['', 'services', 'projects', 'about', 'contact'];
const SERVICE_PAGES = ['shower-glass', 'glass-railings', 'mirrors', 'glass-partitions', 'storefront-glass'];
const LOCATION_PAGES = ['jerusalem', 'tel-aviv', 'haifa', 'beer-sheva', 'netanya'];

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

  // Services Pages (Priority 0.8)
  SERVICE_PAGES.forEach((service) => {
    sitemapXml += generateUrlEntry(`services/${service}`, '0.8');
  });

  // Location Pages (Priority 0.8)
  LOCATION_PAGES.forEach((location) => {
    sitemapXml += generateUrlEntry(location, '0.8');
  });

  sitemapXml += `\n</urlset>`;

  const outPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outPath, sitemapXml);
  console.log("Sitemap successfully generated at " + outPath);
};

generateSitemap();
