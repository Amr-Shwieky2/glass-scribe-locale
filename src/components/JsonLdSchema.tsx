/**
 * JSON-LD Schema Component (Server Component)
 * Site-wide structured data: LocalBusiness + WebSite.
 * Page-specific schemas (FAQPage, Article, Service, Breadcrumbs) live on their pages.
 */
import { CONTACT_INFO, SOCIAL_LINKS } from '@/data/contact';
import { BUSINESS_INFO } from '@/data/business-info';
import { SERVICES } from '@/data/services';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';
import { SITE_URL, OG_IMAGE } from '@/data/seo';
import { toAggregateRatingSchema, type AggregateRating } from '@/lib/google-places';

interface JsonLdSchemaProps {
  lang: SupportedLocale;
  /** Live Google rating; aggregateRating is omitted when null. */
  rating: AggregateRating | null;
}

export const BUSINESS_ID = `${SITE_URL}/#business`;

const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ lang, rating }) => {
  const locale = lang;

  // LocalBusiness schema — the single business entity; other pages reference it by @id
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
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
      addressLocality: 'Jerusalem',
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.7683,
      longitude: 35.2137,
    },
    areaServed: [
      { '@type': 'City', name: 'Jerusalem', sameAs: 'https://en.wikipedia.org/wiki/Jerusalem' },
      { '@type': 'City', name: 'Tel Aviv', sameAs: 'https://en.wikipedia.org/wiki/Tel_Aviv' },
      { '@type': 'City', name: 'Haifa', sameAs: 'https://en.wikipedia.org/wiki/Haifa' },
      { '@type': 'City', name: 'Beer Sheva' },
      { '@type': 'City', name: 'Netanya' },
      { '@type': 'City', name: 'Rishon LeZion' },
      { '@type': 'City', name: 'Petah Tikva' },
      { '@type': 'City', name: 'Ashdod' },
      { '@type': 'City', name: 'Herzliya' },
      { '@type': 'City', name: 'Rehovot' },
      { '@type': 'City', name: 'Modiin' },
      { '@type': 'City', name: 'Ramat Gan' },
      { '@type': 'Country', name: 'Israel', sameAs: 'https://en.wikipedia.org/wiki/Israel' },
    ],
    knowsAbout: [
      'Glass Installation', 'Shower Enclosures', 'Glass Railings', 'Mirrors',
      'Tempered Glass', 'Glass Partitions', 'Storefronts', 'Glass Doors',
      'מקלחונים', 'מעקות זכוכית', 'מראות', 'זכוכית מחוסמת',
      'زجاج الدش', 'درابزين زجاجي', 'مرايا', 'واجهات زجاجية',
      'Душевые кабины', 'Стеклянные ограждения', 'Зеркала',
    ],
    aggregateRating: toAggregateRatingSchema(rating),
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
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.googleKnowledgeGraph,
      SOCIAL_LINKS.google,
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
      OG_IMAGE,
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
    inLanguage: ['he', 'en', 'ar', 'ru'],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  );
};

export default JsonLdSchema;
