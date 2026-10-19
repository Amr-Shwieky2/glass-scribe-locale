/**
 * Tiny browser events that connect the chat launcher to the rest of the page,
 * without importing the (lazy-loaded) chat panel.
 */

export const OPEN_CHAT_EVENT = 'shwaki:open-chat';
export const COOKIE_CONSENT_EVENT = 'shwaki:cookie-consent';

export interface ChatSeed {
  question: string;
  answer: string;
}

/** Opens the chat; with a seed, the question + answer are added to the conversation. */
export function openChat(seed?: ChatSeed): void {
  window.dispatchEvent(new CustomEvent<ChatSeed | undefined>(OPEN_CHAT_EVENT, { detail: seed }));
}

/** Fired by the cookie banner once the visitor has made a choice. */
export function notifyCookieConsent(): void {
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

/** True when the cookie banner has already been answered (so it isn't covering the page). */
export function hasCookieConsent(): boolean {
  try {
    return localStorage.getItem('cookie-consent') !== null;
  } catch {
    return true; // storage blocked: the banner can't persist either, don't hide the chat forever
  }
}
