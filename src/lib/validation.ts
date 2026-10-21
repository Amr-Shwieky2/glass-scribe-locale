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

/**
 * Reads and parses a JSON request body, refusing anything over `maxBytes` —
 * counted while streaming, so a chunked request without Content-Length can't
 * get past the limit. Returns { tooLarge: true } or { value } (null if not JSON).
 */
export async function readJsonBody(req: Request, maxBytes: number): Promise<{ tooLarge: true } | { tooLarge: false; value: unknown }> {
  if (Number(req.headers.get('content-length') || 0) > maxBytes) return { tooLarge: true };
  if (!req.body) return { tooLarge: false, value: null };

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      return { tooLarge: true };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return { tooLarge: false, value: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { tooLarge: false, value: null };
  }
}
