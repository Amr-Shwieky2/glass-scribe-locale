/**
 * Google Analytics 4 — the single source of the measurement ID.
 *
 * The layout bootstraps GA with an inline script: it defines `gtag`, queues
 * `js` + `config` (the only page_view for the initial load) and loads gtag.js
 * lazily. Client-side route changes are counted by GA4's enhanced measurement
 * ("page changes based on browser history events"), so nothing here sends page
 * views — sending them manually as well would double-count.
 *
 * No 'use client' directive: the layout (a Server Component) imports GA_ID, and
 * a constant exported from a client module would arrive there as a client
 * reference instead of a string. The functions below only touch `window`.
 */

export const GA_ID = 'G-ZMSX4TGLBJ';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

/**
 * Sends a GA4 event (WhatsApp/call clicks, lead form, AI search…).
 * Works before gtag.js has loaded: the layout's stub queues the call in dataLayer.
 */
export const trackEvent = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', action, {
    send_to: GA_ID,
    event_category: category,
    event_label: label,
    value,
  });
};
