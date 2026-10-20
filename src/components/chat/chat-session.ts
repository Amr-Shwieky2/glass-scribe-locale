/**
 * The conversation lives only in this browser tab (sessionStorage): it survives
 * moving between pages and reloads, and is gone when the tab closes. Nothing
 * is stored on the server.
 */
import type { AssistantReply, QuoteDraft, ReplyAction, ReplyLink, ReplySuggestion } from '@/lib/chat-protocol';
import { isLocale } from '@/lib/i18n';
import type { SupportedLocale } from '@/data/types';

export type QuoteStep = 'product' | 'city' | 'size' | 'timing' | 'name' | 'phone';

export interface QuoteFlow {
  step: QuoteStep;
  /** Language the request is asked in: the visitor's (from the reply that started it), which may differ from the page. */
  lang: SupportedLocale;
  /** The visitor's answers; product is the product's label in the visitor's language. */
  data: { product?: string; city?: string; size?: string; timing?: string; name?: string; phone?: string };
}

export interface UiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Added by the widget itself (quote steps, thank-you notes) — never sent to the server. */
  local?: boolean;
  /** An official FAQ answer (popular questions). */
  faq?: boolean;
  links?: ReplyLink[];
  /** Related questions under an answer, or the options of "Did you mean…?" (didYouMean). */
  suggestions?: ReplySuggestion[];
  didYouMean?: boolean;
  /** Language of an assistant reply (its suggestions are answered in it). */
  lang?: SupportedLocale;
  actions?: ReplyAction[];
  /** What the reply already knew for a quote request (product / city) — its "Get a free quote" button starts with it. */
  quotePrefill?: AssistantReply['quotePrefill'];
  /** For a hand-off: the visitor's question, pre-filled in the WhatsApp link. */
  question?: string;
  /** A hand-off carried over from an older session: no content of its own, shown with the "not sure" text of the page. */
  handoff?: boolean;
  /** A quote step: its buttons are shown while it is the current step. */
  step?: QuoteStep;
  /** Waiting for the reply (never persisted as true). */
  pending?: boolean;
}

export interface ChatSessionState {
  v: 2;
  messages: UiMessage[];
  quote: QuoteDraft | null;
  flow: QuoteFlow | null;
}

/** A v1 message (streamed AI answers): contact buttons were a flag, and an answer could be cut off part-way. */
type V1Message = UiMessage & { contactActions?: boolean; cut?: boolean; streaming?: boolean };

const KEY = 'shwaki-chat-v1';

function fromV1({ contactActions, cut, streaming, ...m }: V1Message): UiMessage {
  return contactActions ? { ...m, actions: ['whatsapp', 'call'] } : m;
}

export function loadChatSession(): ChatSessionState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { v?: number; messages?: V1Message[]; quote?: QuoteDraft | null; flow?: QuoteFlow | null; fallback?: unknown };
    if ((data?.v !== 1 && data?.v !== 2) || !Array.isArray(data.messages)) return null;
    const messages = data.messages
      .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && typeof m.id === 'string' && (m.content.trim() !== '' || m.handoff) && !m.pending)
      .map((m) => (data.v === 1 ? fromV1(m) : m));
    // v1 showed its fallback (AI unavailable / limit reached) under the conversation: it carries over as a hand-off to our team
    if (data.v === 1 && data.fallback) {
      messages.push({ id: 'v1-handoff', role: 'assistant', content: '', local: true, handoff: true, actions: ['quote', 'whatsapp', 'call'] });
    }
    return {
      v: 2,
      messages,
      quote: data.quote && isLocale(data.quote.language) ? data.quote : null,
      // A flow saved without its language (before it had one) is dropped rather than asked in the wrong language
      flow: data.v === 2 && data.flow && isLocale(data.flow.lang) ? data.flow : null,
    };
  } catch {
    return null;
  }
}

export function saveChatSession(state: ChatSessionState): void {
  try {
    // A reply still loading is not saved, so a reload never shows a blank bubble
    sessionStorage.setItem(KEY, JSON.stringify({ ...state, messages: state.messages.filter((m) => !m.pending) }));
  } catch {
    /* storage full or blocked — the chat still works for this page view */
  }
}

export function clearChatSession(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
