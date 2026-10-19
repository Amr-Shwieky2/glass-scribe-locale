import { SupportedLocale } from '@/data';

// City geo coordinates mapping for local SEO
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  jerusalem: { lat: 31.7683, lng: 35.2137 },
  'tel-aviv': { lat: 32.0853, lng: 34.7818 },
  haifa: { lat: 32.7940, lng: 34.9896 },
  'beer-sheva': { lat: 31.2530, lng: 34.7915 },
  netanya: { lat: 32.3215, lng: 34.8532 },
  // Fallback defaults to Jerusalem's coordinates
  default: { lat: 31.7683, lng: 35.2137 }
};

export const CITY_NAMES_EN: Record<string, string> = {
  jerusalem: 'Jerusalem',
  'tel-aviv': 'Tel Aviv',
  haifa: 'Haifa',
  'beer-sheva': 'Beer Sheva',
  netanya: 'Netanya',
};

/**
 * Validates and normalizes coordinate generation for metadata 
 * based on the city slug provided.
 */
export function getGeoMetaTags(slug: string, locale: SupportedLocale | string) {
  const coords = CITY_COORDINATES[slug] || CITY_COORDINATES.default;
  const cityName = CITY_NAMES_EN[slug] || 'Israel';
  
  return {
    position: `${coords.lat};${coords.lng}`,
    region: 'IL',
    placename: cityName
  };
}
