/**
 * Wire format between the assistant routes (/api/chat, /api/ask) and the
 * widgets. Shared by server and client.
 *
 * Request  /api/chat: { messages: ChatTurn[], lang }  — answer the last visitor message
 *                     { entryId, lang }               — a "Did you mean" / related question button
 * Request  /api/ask:  { question, lang } | { entryId, lang }
 * Response (both):    { reply: AssistantReply }        — always 200, never an error for the visitor
 */
import type { SupportedLocale } from '@/data/types';

export type ChatRole = 'user' | 'assistant';

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

export interface ReplyLink {
  title: string;
  /** Our own page, already localized (/he/glass-shower-installation). */
  url: string;
}

export interface ReplySuggestion {
  /** Knowledge base entry id — answered with { entryId } on click. */
  id: string;
  question: string;
}

export type ReplyAction = 'quote' | 'whatsapp' | 'call';

/** Products offered in the guided quote request. */
export const QUOTE_PRODUCTS = ['shower', 'railing', 'mirror', 'storefront', 'partition', 'door', 'backsplash', 'shelf', 'other'] as const;
export type QuoteProduct = (typeof QUOTE_PRODUCTS)[number];

export interface AssistantReply {
  /**
   * answer    — an answer (knowledge base, generated from live data, or the free-tier AI)
   * suggest   — "Did you mean…?" with up to 3 questions
   * smalltalk — greeting / thanks / complaint
   * quote     — start the guided quote request
   * none      — no good answer: hand-off to our team (quote, WhatsApp, call)
   */
  kind: 'answer' | 'suggest' | 'smalltalk' | 'quote' | 'none';
  /** Language of the reply (the visitor's language, which may differ from the page). */
  lang: SupportedLocale;
  /** Plain text with simple Markdown (paragraphs, lists, **bold**, [links](…)). */
  text: string;
  links?: ReplyLink[];
  /** Related questions (answer) or "Did you mean…?" options (suggest). */
  suggestions?: ReplySuggestion[];
  /** Buttons shown under the message. */
  actions?: ReplyAction[];
  /** Knowledge base entry this message answers. */
  entryId?: string;
  /** Who answered: 1 = our answer engine, 2 = free-tier AI, 3 = our team (hand-off). */
  layer: 1 | 2 | 3;
  /** The guided quote request starts right after this message. */
  startQuote?: boolean;
  /** What we already know for the quote request (product / city mentioned by the visitor). */
  quotePrefill?: { product?: QuoteProduct; city?: string };
}

export interface QuoteDraft {
  name: string;
  phone: string;
  city: string;
  service: string;
  details: string;
  language: SupportedLocale;
}

/** Quote-request field limits — guided flow, quote card and /api/chat/lead. */
export const QUOTE_FIELD_LIMITS = { name: 60, phone: 25, city: 60, service: 80, details: 600 } as const;

export const CHAT_LIMITS = {
  /** Messages the server keeps from the history. */
  maxMessages: 12,
  /** Max characters in one visitor message. */
  maxUserChars: 500,
  /** Max characters of one assistant message echoed back by the client. */
  maxAssistantChars: 4000,
  /** Max characters of the conversation summary sent with a lead. */
  maxSummaryChars: 600,
} as const;
