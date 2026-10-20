/**
 * The assistant's knowledge base: every topic file in one list, plus the checks
 * the content must pass (run by `npm run test:answers` in CI). Server-only.
 */
import { LOCATION_SLUGS } from '../locations';
import { BLOG_POSTS } from '../blog-posts';
import { SERVICE_SEO_PAGES } from '../service-seo-content';
import type { SupportedLocale } from '../types';
import { KNOWLEDGE_TOPICS, type KnowledgeEntry } from './types';
import showers from './showers';
import railings from './railings';
import mirrors from './mirrors';
import storefronts from './storefronts';
import partitions from './partitions';
import otherProducts from './other-products';
import glassTypes from './glass-types';
import safety from './safety';
import maintenance from './maintenance';
import prices from './prices';
import process from './process';
import warranty from './warranty';
import serviceAreas from './service-areas';
import contact from './contact';
import company from './company';

export type { KnowledgeEntry, KnowledgeTopic } from './types';

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  ...showers, ...railings, ...mirrors, ...storefronts, ...partitions, ...otherProducts,
  ...glassTypes, ...safety, ...maintenance, ...prices, ...process, ...warranty,
  ...serviceAreas, ...contact, ...company,
];

/** Only approved entries are ever shown to visitors. */
export const APPROVED_ENTRIES: KnowledgeEntry[] = KNOWLEDGE_BASE.filter((e) => e.status === 'approved');

const byId = new Map(APPROVED_ENTRIES.map((e) => [e.id, e]));

/** An approved entry by id. */
export function getEntry(id: string): KnowledgeEntry | undefined {
  return byId.get(id);
}

/** Our pages an entry may link to (without the language prefix). */
export const LINKABLE_PATHS: ReadonlySet<string> = new Set([
  '/', '/services', '/projects', '/about', '/contact', '/contractors', '/blog',
  ...SERVICE_SEO_PAGES.map((p) => `/${p.slug}`),
  ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
  ...LOCATION_SLUGS.map((slug) => `/${slug}`),
]);

const LOCALES: SupportedLocale[] = ['he', 'en', 'ar', 'ru'];
const MIN_PARAPHRASES = 10;
const words = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/**
 * Content rules for the knowledge base; returns one message per problem (empty = all good).
 * `knownIds`: ids relatedIds may point to (default: the entries checked) — pass the whole
 * knowledge base when checking one topic file.
 */
export function validateKnowledgeBase(entries: KnowledgeEntry[] = KNOWLEDGE_BASE, knownIds?: ReadonlySet<string>): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const e of entries) {
    const at = `[${e.id}]`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(e.id)) errors.push(`${at} id must be kebab-case`);
    if (ids.has(e.id)) errors.push(`${at} duplicate id`);
    ids.add(e.id);
    if (!(KNOWLEDGE_TOPICS as readonly string[]).includes(e.topic)) errors.push(`${at} unknown topic ${e.topic}`);
    if (!e.source.trim()) errors.push(`${at} missing source`);
    if (e.status === 'draft' && !e.review?.trim()) errors.push(`${at} draft without a review question`);
    if (e.links.length > 3) errors.push(`${at} more than 3 links`);
    for (const link of e.links) if (!LINKABLE_PATHS.has(link)) errors.push(`${at} unknown link ${link}`);
    for (const l of LOCALES) {
      if (!e.question[l]?.trim()) errors.push(`${at} missing question (${l})`);
      if (!e.answer[l]?.trim()) errors.push(`${at} missing answer (${l})`);
      if (e.status === 'approved') {
        const paraphrases = e.paraphrases[l] ?? [];
        if (paraphrases.length < MIN_PARAPHRASES) errors.push(`${at} only ${paraphrases.length} ${l} paraphrases (min ${MIN_PARAPHRASES})`);
        if (!e.official && !e.generated) {
          const n = words(e.answer[l] ?? '');
          if (n < 40 || n > 120) errors.push(`${at} ${l} answer has ${n} words (40–120)`);
        }
      }
    }
  }
  const linkable = knownIds ?? ids;
  for (const e of entries) {
    for (const id of e.relatedIds) if (!linkable.has(id)) errors.push(`[${e.id}] unknown relatedId ${id}`);
  }
  return errors;
}
