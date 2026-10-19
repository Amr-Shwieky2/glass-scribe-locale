/**
 * Location-Specific JSON-LD Schema (Server Component)
 * A city-scoped Service whose provider is the site-wide LocalBusiness (by @id),
 * plus the page breadcrumb. Optimized for local SEO: "זגג ירושלים", "glass installation Tel Aviv", etc.
 */

import { CONTACT_INFO } from '@/data/contact';
import { BUSINESS_INFO } from '@/data/business-info';
import { SERVICES } from '@/data/services';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';
import { SITE_URL, pageUrl } from '@/data/seo';
import { BUSINESS_ID } from './JsonLdSchema';

// City geo coordinates
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  jerusalem: { lat: 31.7683, lng: 35.2137 },
  'tel-aviv': { lat: 32.0853, lng: 34.7818 },
  haifa: { lat: 32.7940, lng: 34.9896 },
  'beer-sheva': { lat: 31.2530, lng: 34.7915 },
  netanya: { lat: 32.3215, lng: 34.8532 },
};

// City names for schema
const CITY_NAMES: Record<string, Record<SupportedLocale, string>> = {
  jerusalem: { he: 'ירושלים', en: 'Jerusalem', ar: 'القدس', ru: 'Иерусалим' },
  'tel-aviv': { he: 'תל אביב', en: 'Tel Aviv', ar: 'تل أبيب', ru: 'Тель-Авив' },
  haifa: { he: 'חיפה', en: 'Haifa', ar: 'حيفا', ru: 'Хайфа' },
  'beer-sheva': { he: 'באר שבע', en: 'Beer Sheva', ar: 'بئر السبع', ru: 'Беэр-Шева' },
  netanya: { he: 'נתניה', en: 'Netanya', ar: 'نتانيا', ru: 'Нетания' },
};

// Neighborhoods served per city
const CITY_NEIGHBORHOODS: Record<string, string[]> = {
  jerusalem: ['Ein Kerem', 'Talpiot', 'Katamon', 'German Colony', 'Beit HaKerem', 'Rehavia', 'Givat Ram', 'Malha'],
  'tel-aviv': ['Florentin', 'Neve Tzedek', 'Rothschild', 'Ramat Aviv', 'Jaffa', 'North Tel Aviv', 'Sarona', 'HaYarkon'],
  haifa: ['Carmel', 'Hadar', 'Neve Sha\'anan', 'Bat Galim', 'Kiryat Eliezer', 'Krayot', 'Nesher', 'Tirat Carmel'],
  'beer-sheva': ['Old City', 'Ramot', 'Neve Noy', 'Neve Ze\'ev', 'Omer', 'Meitar', 'Dimona', 'Arad'],
};

// Wikidata IDs for cities
const WIKIDATA_IDS: Record<string, string> = {
  jerusalem: 'Q1218',
  'tel-aviv': 'Q33935',
  haifa: 'Q41621',
  'beer-sheva': 'Q165305',
};

interface LocationJsonLdProps {
  city: string;
  cityName: string;
  locale: SupportedLocale;
}

const LocationJsonLd: React.FC<LocationJsonLdProps> = ({ city, cityName, locale }) => {
  const coords = CITY_COORDINATES[city] || CITY_COORDINATES.jerusalem;
  const localizedCityName = CITY_NAMES[city]?.[locale] || cityName;
  const englishCityName = CITY_NAMES[city]?.en || cityName;
  const neighborhoods = CITY_NEIGHBORHOODS[city] || [];
  const url = pageUrl(locale, `/${city}`);

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: locale === 'he'
      ? `שירותי התקנת זכוכית ב${localizedCityName}`
      : `Glass Installation Services in ${englishCityName}`,
    serviceType: 'Glass Installation',
    url,
    provider: {
      '@type': 'LocalBusiness',
      '@id': BUSINESS_ID,
      name: getLocalizedText(BUSINESS_INFO.name, locale),
      telephone: CONTACT_INFO.phoneIntl,
      url: SITE_URL,
    },
    areaServed: [
      {
        '@type': 'City',
        name: englishCityName,
        ...(WIKIDATA_IDS[city] ? { sameAs: `https://www.wikidata.org/wiki/${WIKIDATA_IDS[city]}` } : {}),
        geo: { '@type': 'GeoCoordinates', latitude: coords.lat, longitude: coords.lng },
      },
      ...neighborhoods.map((neighborhood) => ({ '@type': 'Place', name: neighborhood })),
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'he'
        ? `שירותי התקנת זכוכית ב${localizedCityName}`
        : `Glass Installation Services in ${englishCityName}`,
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
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'he' ? 'בית' : 'Home',
        item: pageUrl(locale),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: localizedCityName,
        item: url,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    </>
  );
};

export default LocationJsonLd;
