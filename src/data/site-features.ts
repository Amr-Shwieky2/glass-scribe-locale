/**
 * Site-wide feature switches.
 */

/**
 * Visible FAQ blocks: the home FAQ section and the "Common questions" block on
 * the service landing pages, together with their FAQPage JSON-LD (Google
 * requires FAQ markup to match FAQ text that is visible on the page).
 *
 * Off: the FAQ content stays in src/data/faq.ts and the service data, and the
 * AI assistant answers it instead — every entry is indexed for /api/ask and
 * /api/chat, and the "Popular questions" chips show the official answers.
 */
export const SHOW_FAQ_SECTIONS = false;
