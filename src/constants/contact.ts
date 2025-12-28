/**
 * Business Contact Information
 * CRITICAL: These are the ONLY contact details for Fusion Glassworks
 * Used throughout the entire website - never hardcode these values elsewhere
 */

export const BUSINESS_INFO = {
  // Primary Contact
  phone: {
    display: '058-5022264',
    link: 'tel:+972585022264',
    international: '+972-58-5022264',
  },
  
  // WhatsApp (same number)
  whatsapp: {
    number: '972585022264', // Format for WhatsApp API (no + or -)
    link: 'https://wa.me/972585022264',
    displayText: '058-5022264',
  },
  
  // Email
  email: {
    address: 'glassworksfusion@gmail.com',
    link: 'mailto:glassworksfusion@gmail.com',
  },
  
  // Website
  website: {
    url: 'https://fusion-glassworks.co.il/',
    display: 'fusion-glassworks.co.il',
  },
  
  // Business Details
  company: {
    name: 'Fusion Glassworks',
    nameHE: 'פיוז\'ן זכוכית',
    nameAR: 'فيوجن للزجاج',
  },
} as const;

/**
 * DEPRECATED: Use BUSINESS_INFO instead
 * Keeping for backward compatibility during migration
 */
export const CONTACT_INFO = {
  phone: BUSINESS_INFO.phone.international,
  whatsapp: BUSINESS_INFO.phone.international,
} as const;

/**
 * Get WhatsApp link with optional pre-filled message
 * @param message - Optional message to pre-fill
 * @returns WhatsApp URL
 */
export const getWhatsAppLink = (message?: string): string => {
  const baseUrl = BUSINESS_INFO.whatsapp.link;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
};

/**
 * Get phone call link
 * @returns Tel link
 */
export const getPhoneLink = (): string => {
  return BUSINESS_INFO.phone.link;
};

/**
 * Get email link with optional subject and body
 * @param subject - Email subject
 * @param body - Email body
 * @returns Mailto link
 */
export const getEmailLink = (subject?: string, body?: string): string => {
  const baseUrl = BUSINESS_INFO.email.link;
  const params = [];
  
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  
  return params.length > 0 ? `${baseUrl}?${params.join('&')}` : baseUrl;
};
