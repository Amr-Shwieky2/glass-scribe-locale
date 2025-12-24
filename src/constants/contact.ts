/**
 * Contact Information Constants
 * Centralized contact details for the application
 */

export const CONTACT_INFO = {
  phone: '+972501234567',
  whatsapp: '+972501234567',
} as const;

/**
 * Generates WhatsApp link with pre-filled message
 */
export const getWhatsAppLink = (message: string): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodedMessage}`;
};

/**
 * Generates phone call link
 */
export const getPhoneLink = (): string => {
  return `tel:${CONTACT_INFO.phone}`;
};
