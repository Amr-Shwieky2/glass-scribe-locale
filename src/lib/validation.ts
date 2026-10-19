/**
 * Small server-side input helpers shared by the contact form and chat routes.
 */

/** Strips control characters (keeps newlines/tabs) and trims. Non-strings become ''. */
export function cleanText(value: unknown): string {
  return typeof value === 'string'
    ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()
    : '';
}

/**
 * Israeli numbers (05X-XXXXXXX mobiles, 0X-XXXXXXX landlines, with or without
 * +972 / 972) or any international number in E.164 form (+ and 8–15 digits).
 * Spaces, dashes, dots and parentheses are allowed as separators.
 */
export function isValidPhone(raw: string): boolean {
  if (!/^\+?[\d\s\-().]{7,25}$/.test(raw)) return false;
  const plus = raw.trim().startsWith('+');
  const digits = raw.replace(/\D/g, '');

  // Israeli: national 0XXXXXXXX(X) or international 972XXXXXXXX(X)
  const national = digits.startsWith('972') ? `0${digits.slice(3)}` : digits;
  if (/^0(5\d{8}|[23489]\d{7}|7\d{8})$/.test(national)) return true;

  // Other countries: must be written with a leading + (E.164)
  return plus && !digits.startsWith('972') && digits.length >= 8 && digits.length <= 15 && !digits.startsWith('0');
}
