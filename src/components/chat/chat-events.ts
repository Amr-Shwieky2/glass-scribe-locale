/**
 * Tiny browser events that connect the chat launcher to the rest of the page
 * (header, mobile bar, Ask AI section, service pages), without loading the
 * lazy chat panel until it is needed.
 */

export const OPEN_CHAT_EVENT = 'shwaki:open-chat';

export type ChatSeed =
  /** A question with a ready answer: Ask AI "Continue in chat", or an official FAQ answer (`faq`). */
  | { question: string; answer: string; faq?: boolean }
  /** Text put in the message box for the visitor to finish, e.g. "Question about glass railings: ". */
  | { draft: string };

/** The chat panel chunk. Calling it early (hover, focus, touch) makes opening instant. */
export const loadChatPanel = () => import('./ChatPanel');

/** Opens the chat; a seed adds a question + answer, or pre-fills the message box. */
export function openChat(seed?: ChatSeed): void {
  window.dispatchEvent(new CustomEvent<ChatSeed | undefined>(OPEN_CHAT_EVENT, { detail: seed }));
}

/** True when the cookie banner has already been answered (so it isn't covering the page). */
export function hasCookieConsent(): boolean {
  try {
    return localStorage.getItem('cookie-consent') !== null;
  } catch {
    return true; // storage blocked: the banner can't persist its answer either
  }
}

/**
 * The always-visible chat buttons (floating launcher, mobile bottom bar, header)
 * carry this attribute, so focus can return to one of them when the chat closes
 * and the control that opened it is gone (e.g. the mobile menu closed).
 */
export const CHAT_TRIGGER_ATTR = 'data-chat-trigger';
