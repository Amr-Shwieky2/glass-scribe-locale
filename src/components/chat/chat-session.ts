/**
 * The conversation lives only in this browser tab (sessionStorage): it survives
 * moving between pages and reloads, and is gone when the tab closes. Nothing
 * is stored on the server.
 */
import type { ChatFallbackReason, QuoteDraft } from '@/lib/chat-protocol';
import type { SiteHit } from '@/lib/search/client';

export interface UiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Added by the widget itself (thank-you / cancelled notes), not by the model. */
  local?: boolean;
  /** Show WhatsApp + call buttons under this message. */
  contactActions?: boolean;
  /** The answer stream broke off part-way. */
  cut?: boolean;
  /** Still streaming (never persisted as true). */
  streaming?: boolean;
}

export interface ChatSessionState {
  v: 1;
  messages: UiMessage[];
  quote: QuoteDraft | null;
  fallback: { reason: ChatFallbackReason; hits: SiteHit[] } | null;
}

const KEY = 'shwaki-chat-v1';

export function loadChatSession(): ChatSessionState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as ChatSessionState;
    if (data?.v !== 1 || !Array.isArray(data.messages)) return null;
    return {
      v: 1,
      messages: data.messages
        .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && typeof m.id === 'string' && m.content.trim() !== '')
        .map((m) => ({ ...m, streaming: false })),
      quote: data.quote ?? null,
      fallback: data.fallback ?? null,
    };
  } catch {
    return null;
  }
}

export function saveChatSession(state: ChatSessionState): void {
  try {
    // A reply still streaming is saved as "cut off" (or not at all if still empty), so a reload never shows a blank bubble
    const messages = state.messages
      .filter((m) => !(m.streaming && !m.content.trim()))
      .map(({ streaming, ...m }) => (streaming ? { ...m, cut: true } : m));
    sessionStorage.setItem(KEY, JSON.stringify({ ...state, messages }));
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
