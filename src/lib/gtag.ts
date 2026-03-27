/**
 * Google Ads & Analytics Utility
 * Helper functions to trigger custom events for Google platform conversions.
 */

// Use environment variable or fallback to placeholder.
// The user should replace the placeholder with their actual AW-ID (Google Ads) or G-ID (GA4).
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'AW-1234567890';

/**
 * Track a pageview manually (useful for SPAs like React Router).
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-expect-error - gtag may not be defined in dev
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value?: number;
}

/**
 * Dispatch a custom event to Google Ads/Analytics.
 * Call this when users click WhatsApp, Call, or submit Contact Form.
 */
export const trackEvent = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-expect-error - gtag may not be defined in dev
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
    // gtag not loaded — silently skip in production
  }
};
