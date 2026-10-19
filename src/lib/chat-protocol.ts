/**
 * Wire format between /api/chat and the chat widget. Shared by server and client.
 *
 * Success: `application/x-ndjson`, one JSON object per line:
 *   {"type":"text","text":"…"}        streamed answer text
 *   {"type":"quote","quote":{…}}      the model asked to show the quote form
 *   {"type":"fallback","reason":"…"}  the answer failed before any text
 *   {"type":"error"}                  the answer was cut off mid-way
 *   {"type":"done"}
 * Unavailable / rate-limited: `application/json` `{ "fallback": reason }`.
 */
import type { SupportedLocale } from '@/data/types';

export type ChatRole = 'user' | 'assistant';

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

export interface QuoteDraft {
  name: string;
  phone: string;
  city: string;
  service: string;
  details: string;
  language: SupportedLocale;
}

export type ChatFallbackReason = 'unavailable' | 'rate_limited' | 'daily_limit' | 'error';

export type ChatStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'quote'; quote: QuoteDraft }
  | { type: 'fallback'; reason: ChatFallbackReason }
  | { type: 'error' }
  | { type: 'done' };

/** Quote-request field limits — tool schema sanitizer, quote card and /api/chat/lead. */
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
