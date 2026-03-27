/**
 * JSON-LD Schema Component
 * Provides structured data for SEO and AI search optimization
 * Includes LocalBusiness, FAQPage, and Service schemas
 */

import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_INFO, BUSINESS_INFO, SERVICES, getLocalizedText, type SupportedLocale } from '@/data';

// Removed FAQ data as it is now encapsulated in FAQSection.tsx

const JsonLdSchema: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const location = useLocation();
  const locale = currentLanguage as SupportedLocale;

  // Determine current page
  const pathParts = location.pathname.split('/').filter(Boolean);
  const page = pathParts[1] || 'home';

  // Check if we are on a specialized page that provides its own specific schemas
  const isLocationPage = pathParts[1] === 'location' || 
                         location.pathname.includes('glass-installation-') || 
                         ['jerusalem', 'tel-aviv', 'haifa', 'beer-sheva'].includes(pathParts[1]);
                         
  const isServicePage = (pathParts[1] === 'services' && pathParts.length > 2) || 
                        ['glass-shower-installation', 'glass-railing', 'glass-mirrors', 'shop-front-glass', 'glass-partitions'].includes(pathParts[1]);

  const shouldRenderGlobalBusiness = !isLocationPage;
  const shouldRenderGlobalBreadcrumb = !isLocationPage && !isServicePage;

  // LocalBusiness schema (always present unless on location page)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.shwakiglassworks.com/#business',
    name: getLocalizedText(BUSINESS_INFO.name, locale),
    alternateName: ['Shwaki Brothers Glassworks', 'אחים שוואקי זכוכית', 'شويكي اخوان للزوجاج'],
    description: locale === 'he' 
      ? 'מומחים להתקנת זכוכית בישראל - מקלחונים, מעקות זכוכית, מראות, חזיתות חנויות. מדידה חינם, אחריות שנתיים.'
      : 'Professional glass installation in Israel - shower enclosures, glass railings, mirrors, storefronts. Free measurement, 2-year warranty.',
    url: 'https://www.shwakiglassworks.com',
    telephone: CONTACT_INFO.phoneIntl,
    email: CONTACT_INFO.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IL',
      addressLocality: 'Israel',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.7683, // Israel center
      longitude: 35.2137,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Israel',
    },
    priceRange: '₪₪',
    currenciesAccepted: 'ILS',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '08:00',
        closes: '13:00',
      },
    ],
    sameAs: [
      `https://wa.me/${CONTACT_INFO.whatsapp}`,
      'https://www.instagram.com/shwaki_glassworks/',
      'https://www.facebook.com/profile.php?id=100063765481345',
      'https://g.page/r/shwaki-glassworks',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Glass Installation Services',
      itemListElement: SERVICES.slice(0, 6).map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: getLocalizedText(service.title, 'en'),
          description: getLocalizedText(service.description, 'en'),
        },
        position: index + 1,
      })),
    },
    image: [
      'https://www.shwakiglassworks.com/og-image.jpg',
    ],
    foundingDate: BUSINESS_INFO.established,
  };



  // WebSite schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Shwaki Brothers Glassworks',
    alternateName: 'אחים שוואקי זכוכית',
    url: 'https://www.shwakiglassworks.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.shwakiglassworks.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['he', 'en', 'ar', 'ru'],
  };

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'he' ? 'בית' : 'Home',
        item: `https://www.shwakiglassworks.com/${locale}`,
      },
      ...(page !== 'home' ? [{
        '@type': 'ListItem',
        position: 2,
        name: page.charAt(0).toUpperCase() + page.slice(1),
        item: `https://www.shwakiglassworks.com/${locale}/${page}`,
      }] : []),
    ],
  };

  return (
    <Helmet>
      {shouldRenderGlobalBusiness && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {shouldRenderGlobalBreadcrumb && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default JsonLdSchema;
