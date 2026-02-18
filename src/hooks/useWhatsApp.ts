/**
 * useWhatsApp Hook
 * Shared WhatsApp handler used across all pages.
 * Opens WhatsApp with the business phone and an optional pre-filled message.
 */

import { useCallback } from 'react';
import { CONTACT_INFO } from '@/data/business';

/**
 * Returns a memoized handler that opens WhatsApp with an optional message.
 *
 * @param message - Optional pre-filled message (plain text, will be URL-encoded)
 * @returns Click handler function
 *
 * @example
 * const handleWhatsApp = useWhatsApp();
 * const handleWhatsApp = useWhatsApp('Hello, I need a quote');
 */
export function useWhatsApp(message?: string) {
  return useCallback(() => {
    const base = `https://wa.me/${CONTACT_INFO.whatsapp}`;
    const url = message
      ? `${base}?text=${encodeURIComponent(message)}`
      : base;
    window.open(url, '_blank');
  }, [message]);
}
