/**
 * Location-Specific JSON-LD Schema Component
 * Generates LocalBusiness schema with city-specific areaServed
 * Optimized for local SEO: "זגג ירושלים", "glass installation Tel Aviv", etc.
 */

import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_INFO, BUSINESS_INFO, SERVICES, getLocalizedText, type SupportedLocale } from '@/data';

// City geo coordinates
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  jerusalem: { lat: 31.7683, lng: 35.2137 },
  'tel-aviv': { lat: 32.0853, lng: 34.7818 },
  haifa: { lat: 32.7940, lng: 34.9896 },
  'beer-sheva': { lat: 31.2530, lng: 34.7915 },
};

// ... CITY_NAMES and CITY_NEIGHBORHOODS remain the same

// City names for schema
const CITY_NAMES: Record<string, Record<SupportedLocale, string>> = {
  jerusalem: {
    he: 'ירושלים',
    en: 'Jerusalem',
    ar: 'القدس',
    ru: 'Иерусалим',
  },
  'tel-aviv': {
    he: 'תל אביב',
    en: 'Tel Aviv',
    ar: 'تل أبيب',
    ru: 'Тель-Авив',
  },
  haifa: {
    he: 'חיפה',
    en: 'Haifa',
    ar: 'حيفا',
    ru: 'Хайфа',
  },
  'beer-sheva': {
    he: 'באר שבע',
    en: 'Beer Sheva',
    ar: 'بئر السبع',
    ru: 'Беэр-Шева',
  },
};

// Neighborhoods served per city
const CITY_NEIGHBORHOODS: Record<string, string[]> = {
  jerusalem: ['Ein Kerem', 'Talpiot', 'Katamon', 'German Colony', 'Beit HaKerem', 'Rehavia', 'Givat Ram', 'Malha'],
  'tel-aviv': ['Florentin', 'Neve Tzedek', 'Rothschild', 'Ramat Aviv', 'Jaffa', 'North Tel Aviv', 'Sarona', 'HaYarkon'],
  haifa: ['Carmel', 'Hadar', 'Neve Sha\'anan', 'Bat Galim', 'Kiryat Eliezer', 'Krayot', 'Nesher', 'Tirat Carmel'],
  'beer-sheva': ['Old City', 'Ramot', 'Neve Noy', 'Neve Ze\'ev', 'Omer', 'Meitar', 'Dimona', 'Arad'],
};

interface LocationJsonLdProps {
  city: string;
  cityName: string;
}

const LocationJsonLd: React.FC<LocationJsonLdProps> = ({ city, cityName }) => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  
  const coords = useMemo(() => CITY_COORDINATES[city] || CITY_COORDINATES['jerusalem'], [city]);
  const localizedCityName = useMemo(() => CITY_NAMES[city]?.[locale] || cityName, [city, locale, cityName]);
  const neighborhoods = useMemo(() => CITY_NEIGHBORHOODS[city] || [], [city]);

  // LocalBusiness schema with city-specific areaServed
  const locationBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://www.shwakiglassworks.com/${locale}/${city}#business`,
    name: `${getLocalizedText(BUSINESS_INFO.name, locale)} - ${localizedCityName}`,
    alternateName: [
      `Shwaki Brothers Glassworks ${CITY_NAMES[city]?.en || ''}`,
      `אחים שוואקי זכוכית ${CITY_NAMES[city]?.he || ''}`,
      `شويكي اخوان للزوجاج ${CITY_NAMES[city]?.ar || ''}`,
    ],
    description: locale === 'he'
      ? `שירותי התקנת זכוכית מקצועיים ב${localizedCityName} - מקלחונים, מעקות זכוכית, מראות, חזיתות. מדידה חינם, אחריות שנתיים.`
      : `Professional glass installation services in ${CITY_NAMES[city]?.en || cityName} - shower enclosures, glass railings, mirrors, storefronts. Free measurement, 2-year warranty.`,
    url: `https://www.shwakiglassworks.com/${locale}/${city}`,
    telephone: CONTACT_INFO.phoneIntl,
    email: CONTACT_INFO.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CITY_NAMES[city]?.en || cityName,
      addressRegion: city === 'beer-sheva' ? 'Southern District' : city === 'haifa' ? 'Haifa District' : city === 'tel-aviv' ? 'Tel Aviv District' : 'Jerusalem District',
      addressCountry: 'IL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: coords.lat,
      longitude: coords.lng,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
    },
    areaServed: [
      {
        '@type': 'City',
        name: CITY_NAMES[city]?.en || cityName,
        '@id': `https://www.wikidata.org/wiki/${getWikidataId(city)}`,
      },
      ...neighborhoods.map(neighborhood => ({
        '@type': 'Place',
        name: neighborhood,
      })),
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: coords.lat,
        longitude: coords.lng,
      },
      geoRadius: '50km',
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
      name: locale === 'he' 
        ? `שירותי התקנת זכוכית ב${localizedCityName}` 
        : `Glass Installation Services in ${CITY_NAMES[city]?.en || cityName}`,
      itemListElement: SERVICES.slice(0, 6).map((service, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: getLocalizedText(service.title, 'en'),
          description: getLocalizedText(service.description, 'en'),
          areaServed: {
            '@type': 'City',
            name: CITY_NAMES[city]?.en || cityName,
          },
        },
        position: index + 1,
      })),
    },
    image: [
      'https://www.shwakiglassworks.com/og-image.jpg',
    ],
    foundingDate: BUSINESS_INFO.established,
  };

  // BreadcrumbList schema for location page
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
      {
        '@type': 'ListItem',
        position: 2,
        name: localizedCityName,
        item: `https://www.shwakiglassworks.com/${locale}/${city}`,
      },
    ],
  };

  // Service schema for each service in this location
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Glass Installation',
    provider: {
      '@type': 'LocalBusiness',
      '@id': `https://www.shwakiglassworks.com/${locale}/${city}#business`,
      name: `${getLocalizedText(BUSINESS_INFO.name, locale)} - ${localizedCityName}`,
    },
    areaServed: {
      '@type': 'City',
      name: CITY_NAMES[city]?.en || cityName,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Glass Installation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Shower Enclosure Installation',
            description: 'Custom frameless and framed shower glass installation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Glass Railing Installation',
            description: 'Balcony and staircase glass railing installation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Mirror Installation',
            description: 'Custom mirror installation for bathrooms, gyms, and decorative purposes',
          },
        },
      ],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(locationBusinessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

// Helper to get Wikidata IDs for cities
function getWikidataId(city: string): string {
  const ids: Record<string, string> = {
    jerusalem: 'Q1218',
    'tel-aviv': 'Q33935',
    haifa: 'Q41621',
    'beer-sheva': 'Q165305',
  };
  return ids[city] || 'Q801';
}

export default LocationJsonLd;
