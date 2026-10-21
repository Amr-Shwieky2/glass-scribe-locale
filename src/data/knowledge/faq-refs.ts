/**
 * The site's 39 official FAQ pairs (home FAQ + service-page FAQs) as knowledge
 * base entries — question and answer are taken from their source, so the
 * wording stays official and in one place.
 */
import { HOME_FAQ_CONTENT } from '../faq';
import { SERVICE_SEO_PAGES } from '../service-seo-content';
import type { KnowledgeEntry } from './types';

type OfficialFaq = Pick<KnowledgeEntry, 'question' | 'answer' | 'official'>;

/** A home FAQ entry, by its English question (exactly as in src/data/faq.ts). */
export function homeFaq(englishQuestion: string): OfficialFaq {
  const faq = HOME_FAQ_CONTENT.faqs.find((f) => f.question.en === englishQuestion);
  if (!faq) throw new Error(`Home FAQ not found: ${englishQuestion}`);
  return { question: faq.question, answer: faq.answer, official: true };
}

/** A service page's FAQ entry, by page slug and position (0-based) in src/data/service-seo-content.ts. */
export function serviceFaq(slug: string, index: number): OfficialFaq {
  const faq = SERVICE_SEO_PAGES.find((p) => p.slug === slug)?.faqs[index];
  if (!faq) throw new Error(`Service FAQ not found: ${slug} #${index}`);
  return { question: faq.question, answer: faq.answer, official: true };
}
