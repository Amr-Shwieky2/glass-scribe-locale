/**
 * Knowledge base for the website assistant's own answer engine
 * (src/lib/answer-engine). One file per topic in this folder; server-only.
 */
import type { LocalizedArray, LocalizedText } from '../types';

export const KNOWLEDGE_TOPICS = [
  'showers',
  'railings',
  'mirrors',
  'storefronts',
  'partitions',
  'other-products', // glass doors, kitchen backsplashes, shelves
  'glass-types',
  'safety',
  'maintenance',
  'prices',
  'process',
  'warranty',
  'service-areas',
  'contact',
  'company',
] as const;

export type KnowledgeTopic = (typeof KNOWLEDGE_TOPICS)[number];

export interface KnowledgeEntry {
  /** Stable kebab-case id, unique across the whole knowledge base (e.g. "shower-glass-thickness"). */
  id: string;
  topic: KnowledgeTopic;
  question: LocalizedText;
  /**
   * How real customers ask it — at least 10 per language: short phone-style
   * questions, spoken wording, typos, with/without prefixes, transliterations,
   * Arabic as spoken in Israel, Russian with and without "ё".
   */
  paraphrases: LocalizedArray;
  /**
   * 40–120 words, friendly, ending with a soft call to action. Entries made with
   * homeFaq()/serviceFaq() keep the official FAQ wording instead.
   */
  answer: LocalizedText;
  /** 1–3 of our own pages, without the language prefix: "/glass-shower-installation", "/contact". */
  links: string[];
  /** Other entry ids worth offering next ("related questions"). */
  relatedIds: string[];
  /** Only approved entries are used on the site; drafts wait for the owner (KNOWLEDGE_REVIEW.md). */
  status: 'approved' | 'draft';
  /** Where every fact in the answer comes from: "src/data/faq.ts:45" — several separated by "; ". */
  source: string;
  /** Drafts only: the exact question the owner must answer before the entry can be approved. */
  review?: string;
  /** The reply is built at runtime from live data (opening hours, contact details, served cities). */
  generated?: 'hours' | 'contact' | 'city';
  /** Set by homeFaq()/serviceFaq(): official FAQ wording, kept word for word. */
  official?: boolean;
}
