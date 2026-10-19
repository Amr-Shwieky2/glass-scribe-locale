/**
 * Builds the site-search corpus from the real site content (src/data). Used:
 *  - at build time for the static per-language index the browser loads
 *    (app/api/search-index/[lang]), giving instant results without any AI;
 *  - on the server to retrieve the passages that ground AI answers.
 */
import type { SupportedLocale } from '@/data/types';
import { SERVICES } from '@/data/services';
import { SERVICE_SEO_PAGES, getServicePageHref } from '@/data/service-seo-content';
import { BLOG_POSTS } from '@/data/blog-posts';
import { LOCATIONS, LOCATION_SLUGS } from '@/data/locations';
import { HOME_FAQ_CONTENT } from '@/data/faq';
import { CONTACT_INFO } from '@/data/contact';
import { BUSINESS_INFO } from '@/data/business-info';
import { PAGE_CONTENT } from '@/data/page-content';

export type SearchDocType = 'service' | 'faq' | 'blog' | 'location' | 'contact' | 'about';

export interface SearchDoc {
  id: string;
  type: SearchDocType;
  title: string;
  /** One line shown under the title in instant results. */
  snippet: string;
  /**
   * Site-relative URL, already localized (e.g. /he/glass-shower-installation).
   * For an FAQ entry: the page it belongs to, or '' (home FAQ — no page of its own).
   */
  url: string;
  /** Extra short terms boosted in ranking. For an FAQ entry of a service page: that service's name. */
  keywords: string;
  /** Searchable body (truncated in the browser index, full on the server). For an FAQ entry: its official answer. */
  text: string;
}

const oneLine = (s: string, max = 140) => {
  const clean = s.replace(/[#*_>`]/g, '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? clean.slice(0, max - 1).trimEnd() + '…' : clean;
};

const markdownToText = (md: string) => md.replace(/[#*_>`]/g, '').replace(/\n{2,}/g, '\n\n').trim();

const CONTACT_TITLE: Record<SupportedLocale, string> = {
  he: 'צור קשר, שעות פעילות ואחריות', en: 'Contact, opening hours and warranty',
  ar: 'اتصل بنا، ساعات العمل والضمان', ru: 'Контакты, часы работы и гарантия',
};
const CONTACT_FACTS: Record<SupportedLocale, string> = {
  he: 'מדידה חינם. אחריות שנתיים על חומרים ועבודה. שירות בכל רחבי ישראל. הצעת מחיר חינם ללא התחייבות.',
  en: 'Free measurement. 2-year warranty on materials and workmanship. Service across all of Israel. Free, no-obligation quote.',
  ar: 'قياس مجاني. ضمان سنتين على المواد والعمل. خدمة في جميع أنحاء إسرائيل. عرض سعر مجاني بدون التزام.',
  ru: 'Бесплатный замер. Гарантия 2 года на материалы и работу. Обслуживаем весь Израиль. Бесплатный расчёт без обязательств.',
};

export function buildSearchDocs(locale: SupportedLocale): SearchDoc[] {
  const docs: SearchDoc[] = [];
  const L = (path: string) => `/${locale}${path}`;

  // Service landing pages (richest content)
  for (const page of SERVICE_SEO_PAGES) {
    docs.push({
      id: `service-page:${page.slug}`,
      type: 'service',
      title: page.heroTitle[locale],
      snippet: oneLine(page.metaDescription[locale]),
      url: L(`/${page.slug}`),
      keywords: [page.keywords[locale], page.eyebrow[locale], ...page.highlights[locale]].join(' '),
      text: [
        page.intro[locale], page.overview[locale], page.options[locale], page.process[locale],
        page.benefits[locale], page.areasSummary[locale], page.materialOptions[locale].join(', '),
      ].join('\n\n'),
    });
  }

  // Services without a dedicated landing page
  for (const service of SERVICES) {
    if (SERVICE_SEO_PAGES.some((p) => p.serviceId === service.id)) continue;
    docs.push({
      id: `service:${service.id}`,
      type: 'service',
      title: service.title[locale],
      snippet: oneLine(service.description[locale]),
      url: getServicePageHref(locale, service.id) ?? L('/services'),
      keywords: service.features[locale].join(' '),
      text: service.description[locale],
    });
  }

  // FAQ — every question/answer pair is its own doc: the home FAQ and each service
  // page's FAQ. Server retrieval ranks them high so AI answers follow our official
  // wording; in the browser, an FAQ result opens the chat with its official answer.
  // (GENERAL_FAQ isn't shown anywhere; it grounds the AI via the system prompt.)
  HOME_FAQ_CONTENT.faqs.forEach((faq, i) => {
    docs.push({
      id: `faq:${i}`,
      type: 'faq',
      title: faq.question[locale],
      snippet: oneLine(faq.answer[locale]),
      url: '',
      keywords: '',
      text: faq.answer[locale],
    });
  });
  for (const page of SERVICE_SEO_PAGES) {
    page.faqs.forEach((faq, i) => {
      docs.push({
        id: `faq:${page.slug}:${i}`,
        type: 'faq',
        title: faq.question[locale],
        snippet: oneLine(faq.answer[locale]),
        url: L(`/${page.slug}`),
        keywords: page.heroTitle[locale],
        text: faq.answer[locale],
      });
    });
  }

  for (const post of BLOG_POSTS) {
    docs.push({
      id: `blog:${post.slug}`,
      type: 'blog',
      title: post.title[locale],
      snippet: oneLine(post.excerpt[locale]),
      url: L(`/blog/${post.slug}`),
      keywords: post.category,
      text: markdownToText(post.content[locale]),
    });
  }

  for (const slug of LOCATION_SLUGS) {
    const loc = LOCATIONS[slug];
    docs.push({
      id: `location:${slug}`,
      type: 'location',
      title: loc.heroTitle[locale],
      snippet: oneLine(loc.heroSubtitle[locale]),
      url: L(`/${slug}`),
      keywords: [loc.name.en, loc.name.he, loc.name.ar, loc.name.ru, ...loc.areas, ...loc.areasHe].join(' '),
      text: loc.description[locale],
    });
  }

  docs.push({
    id: 'contact',
    type: 'contact',
    title: CONTACT_TITLE[locale],
    snippet: oneLine(`${CONTACT_INFO.phone} · WhatsApp · ${CONTACT_INFO.workingHours[locale]}`),
    url: L('/contact'),
    keywords: `${CONTACT_INFO.phone} ${CONTACT_INFO.email} WhatsApp`,
    text: [
      `${BUSINESS_INFO.name[locale]} — ${BUSINESS_INFO.location[locale]}. ${BUSINESS_INFO.serviceArea[locale]}.`,
      `Phone/WhatsApp: ${CONTACT_INFO.phone}. Email: ${CONTACT_INFO.email}.`,
      CONTACT_INFO.workingHours[locale],
      CONTACT_INFO.responseTime[locale],
      CONTACT_FACTS[locale],
    ].join('\n'),
  });

  docs.push({
    id: 'about',
    type: 'about',
    title: PAGE_CONTENT.about.title[locale],
    snippet: oneLine(PAGE_CONTENT.about.subtitle[locale]),
    url: L('/about'),
    keywords: BUSINESS_INFO.owner,
    text: `${PAGE_CONTENT.about.story[locale]}\n${BUSINESS_INFO.description[locale]}`,
  });

  return docs;
}

/**
 * Browser-index version: same docs with page bodies trimmed to keep the download
 * small. FAQ answers stay whole — the chat shows them as the official answer.
 */
export function buildClientSearchDocs(locale: SupportedLocale, maxText = 600): SearchDoc[] {
  return buildSearchDocs(locale).map((d) => (d.type === 'faq' ? d : { ...d, text: d.text.slice(0, maxText) }));
}
