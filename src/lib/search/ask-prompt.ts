/**
 * Business facts for the optional free-tier AI's system prompt
 * (src/lib/search/chat-prompt.ts). Built only from src/data and fully
 * deterministic; per-question content goes in the visitor turn, not here.
 */
import { BUSINESS_INFO } from '@/data/business-info';
import { CONTACT_INFO } from '@/data/contact';
import { SERVICES } from '@/data/services';
import { SERVICE_SEO_PAGES } from '@/data/service-seo-content';
import { LOCATIONS, LOCATION_SLUGS } from '@/data/locations';
import { GENERAL_FAQ } from '@/data/faq';

let cachedContext: string | null = null;

/** Business facts, service list and general FAQ. Deterministic. */
export function buildBusinessContext(): string {
  if (cachedContext) return cachedContext;

  const services = SERVICES.map((s) => {
    const page = SERVICE_SEO_PAGES.find((p) => p.serviceId === s.id);
    return `- ${s.title.en} / ${s.title.he}${page ? ` (page slug: /${page.slug})` : ''}: ${s.description.en}`;
  }).join('\n');

  const cities = LOCATION_SLUGS.map((slug) => `${LOCATIONS[slug].name.en} (${LOCATIONS[slug].name.he}) – page slug /${slug}`).join('; ');

  const generalFaq = GENERAL_FAQ.en.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n');

  cachedContext = `<business_facts>
- Name: ${BUSINESS_INFO.name.en} / ${BUSINESS_INFO.name.he} / ${BUSINESS_INFO.name.ar} / ${BUSINESS_INFO.name.ru}
- Owner: ${BUSINESS_INFO.owner}. Established ${BUSINESS_INFO.established}. Based in ${BUSINESS_INFO.location.en}; ${BUSINESS_INFO.serviceArea.en.toLowerCase()}.
- Phone and WhatsApp: ${CONTACT_INFO.phone} (${CONTACT_INFO.phoneIntl}). Email: ${CONTACT_INFO.email}.
- Opening hours: ${CONTACT_INFO.workingHours.en}.
- ${CONTACT_INFO.responseTime.en}.
- Free on-site measurement and a free, no-obligation quote.
- Warranty: 2 years on materials and workmanship.
- City pages: ${cities}. We also serve the rest of Israel.
</business_facts>

<services>
${services}
</services>

<general_faq>
${generalFaq}
</general_faq>`;
  return cachedContext;
}

/** How to use official FAQ answers in the provided content (formatSiteContent in retrieve.ts, <knowledge>). */
export const OFFICIAL_FAQ_RULE =
  'Passages marked "Official FAQ" are our official answers to frequent questions. When the visitor\'s question matches one of them, base your answer on that entry, reusing its wording and figures where you can, and never contradict it. If entries for different products differ, use the one for the visitor\'s product.';
