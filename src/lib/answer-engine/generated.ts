/**
 * Answers built from live data instead of fixed text: opening hours (open or
 * closed right now), contact details and the cities we serve.
 */
import { ASSISTANT_REPLIES } from '@/data/assistant-replies';
import { BUSINESS_INFO } from '@/data/business-info';
import { CONTACT_INFO } from '@/data/contact';
import { LOCATIONS, type LocationKey } from '@/data/locations';
import type { SupportedLocale } from '@/data/types';
import { isBusinessOpen } from '@/lib/business-hours';

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');

export function hoursAnswer(lang: SupportedLocale, at = new Date()): string {
  const status = isBusinessOpen(at) ? ASSISTANT_REPLIES.openNow[lang] : ASSISTANT_REPLIES.closedNow[lang];
  return fill(ASSISTANT_REPLIES.hours[lang], { status, hours: CONTACT_INFO.workingHours[lang] });
}

export function contactAnswer(lang: SupportedLocale): string {
  return fill(ASSISTANT_REPLIES.contact[lang], {
    phone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    hours: CONTACT_INFO.workingHours[lang],
  });
}

/**
 * "Do you work in …?" — a city with its own page, another Israeli city we know,
 * or a place we can't confirm (then no "yes": we only know we serve all of Israel).
 */
export function cityAnswer(lang: SupportedLocale, slug?: LocationKey, knownCity = false): string {
  const serviceArea = BUSINESS_INFO.serviceArea[lang];
  if (!slug && !knownCity) return fill(ASSISTANT_REPLIES.cityUnknown[lang], { serviceArea });
  // Mid-sentence there ("Yes — serving all of Israel")
  if (!slug) return fill(ASSISTANT_REPLIES.cityOther[lang], { serviceArea: serviceArea.charAt(0).toLocaleLowerCase(lang) + serviceArea.slice(1) });
  const loc = LOCATIONS[slug];
  const areas = lang === 'he' ? loc.areasHe : lang === 'en' ? loc.areas : [];
  return fill(ASSISTANT_REPLIES.cityPage[lang], {
    city: loc.name[lang],
    areas: areas.length ? ` (${areas.slice(0, 4).join(', ')})` : '',
    serviceArea,
  });
}
