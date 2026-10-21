import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSameOrigin } from '@/lib/ai';
import { verifyCsrfToken } from '@/lib/csrf';
import { isLocale } from '@/lib/i18n';
import { getClientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit';
import { isTelegramConfigured, sendTelegramMessage, type TelegramFormatter } from '@/lib/telegram';
import { cleanText, isValidPhone, readJsonBody } from '@/lib/validation';
import { CHAT_LIMITS, QUOTE_FIELD_LIMITS } from '@/lib/chat-protocol';
import { SITE_URL } from '@/data/seo';

/**
 * Quote request confirmed by the visitor in the chat widget → Telegram.
 *
 * Only called after the visitor reviewed the details and ticked consent. Checks
 * same-origin, the CSRF token and consent, validates every field, allows 3
 * leads per IP per hour, and sends through the shared Telegram helper (HTML
 * with escaped values, plain-text retry). Nothing is stored or logged except
 * the event name and language.
 */

export const runtime = 'nodejs';

const ALLOWED_FIELDS = new Set(['name', 'phone', 'city', 'service', 'details', 'language', 'consent', 'csrfToken', 'page', 'summary']);
const LANGUAGE_NAMES = { he: 'עברית / Hebrew', en: 'English', ar: 'العربية / Arabic', ru: 'Русский / Russian' } as const;

interface Lead {
  name: string;
  phone: string;
  city: string;
  service: string;
  details: string;
  language: keyof typeof LANGUAGE_NAMES;
  page: string;
  summary: string;
}

function validate(body: Record<string, unknown>): { lead: Lead } | { error: string; status?: number } {
  const unexpected = Object.keys(body).find((k) => !ALLOWED_FIELDS.has(k));
  if (unexpected) return { error: `Unexpected field: ${unexpected.slice(0, 32)}` };

  if (!verifyCsrfToken(body.csrfToken)) {
    return { error: 'Session expired. Please reload the page and try again.', status: 403 };
  }
  if (body.consent !== true) return { error: 'Consent required' };

  const lead: Lead = {
    name: cleanText(body.name),
    phone: cleanText(body.phone),
    city: cleanText(body.city),
    service: cleanText(body.service),
    details: cleanText(body.details),
    language: 'he',
    page: cleanText(body.page),
    summary: cleanText(body.summary),
  };

  if (lead.name.length < 2 || lead.name.length > QUOTE_FIELD_LIMITS.name) return { error: 'Invalid name' };
  if (lead.phone.length > QUOTE_FIELD_LIMITS.phone || !isValidPhone(lead.phone)) return { error: 'Invalid phone' };
  if (lead.city.length > QUOTE_FIELD_LIMITS.city) return { error: 'Invalid city' };
  if (lead.service.length > QUOTE_FIELD_LIMITS.service) return { error: 'Invalid service' };
  if (lead.details.length > QUOTE_FIELD_LIMITS.details) return { error: 'Invalid details' };
  if (lead.summary.length > CHAT_LIMITS.maxSummaryChars) return { error: 'Invalid summary' };

  if (typeof body.language !== 'string' || !isLocale(body.language)) return { error: 'Invalid language' };
  lead.language = body.language;

  // Site-relative path only, e.g. /he/glass-shower-installation
  if (lead.page && (!/^\/(?!\/)[\w\-./%]{0,200}$/.test(lead.page))) return { error: 'Invalid page' };

  return { lead };
}

function formatLead(lead: Lead, { bold: b, value: v }: TelegramFormatter): string {
  const dash = (s: string) => (s ? v(s) : '—');
  return [
    `🤖 ${b("בקשת הצעת מחיר מצ'אט האתר / New quote request from website chat")}`,
    '',
    `👤 ${b('שם / Name:')} ${v(lead.name)}`,
    `📱 ${b('טלפון / Phone:')} ${v(lead.phone)}`,
    `📍 ${b('עיר / City:')} ${dash(lead.city)}`,
    `🔧 ${b('שירות / Service:')} ${dash(lead.service)}`,
    `📝 ${b('פרטים / Details:')} ${dash(lead.details)}`,
    `🌐 ${b('שפה / Language:')} ${LANGUAGE_NAMES[lead.language]}`,
    `📄 ${b('עמוד / Page:')} ${lead.page ? v(`${SITE_URL}${lead.page}`) : '—'}`,
    '',
    `💬 ${b('סיכום השיחה / Conversation summary:')}`,
    dash(lead.summary),
  ].join('\n');
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!isTelegramConfigured()) {
    console.error('[chat-lead] Telegram not configured');
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 });
  }

  const raw = await readJsonBody(req, 16 * 1024);
  if (raw.tooLarge) return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  const body = raw.value;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const result = validate(body as Record<string, unknown>);
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: result.status ?? 400 });

  // Counted only for valid, consented requests — typos don't use up the visitor's quota
  const limit = await rateLimit('chat-lead', getClientIp(req.headers), { limit: 3, windowSec: 3600 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });
  }

  const ok = await sendTelegramMessage((f) => formatLead(result.lead, f));
  if (!ok) return NextResponse.json({ error: 'Failed to send request' }, { status: 502 });

  console.log(JSON.stringify({ event: 'chat_quote_sent', lang: result.lead.language }));
  return NextResponse.json({ success: true }, { status: 200 });
}
