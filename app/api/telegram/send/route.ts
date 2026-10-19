import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyCsrfToken } from '@/lib/csrf';
import { getClientIp, rateLimit, rateLimitHeaders } from '@/lib/rate-limit';

/**
 * Contact form → Telegram.
 * Accepts only the form fields below (no free-form `text`), validates them on the
 * server, checks the honeypot and the CSRF token, escapes HTML and rate-limits
 * by IP. If Telegram rejects the HTML message, it retries once as plain text so
 * a lead is never lost.
 */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const ALLOWED_FIELDS = new Set(['name', 'email', 'phone', 'service', 'message', 'website', 'csrfToken']);
const LIMITS = { name: [2, 100], email: [3, 254], phone: [7, 20], service: [0, 100], message: [10, 2000] } as const;
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;
const PHONE_RE = /^\+?[\d\s\-()]{7,20}$/;

type Lead = { name: string; email: string; phone: string; service: string; message: string };

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Strips control characters (keeps newlines/tabs) and trims. */
const clean = (v: unknown) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim() : '');

function validate(body: Record<string, unknown>): { lead: Lead } | { error: string } {
  const lead: Lead = {
    name: clean(body.name),
    email: clean(body.email).toLowerCase(),
    phone: clean(body.phone),
    service: clean(body.service),
    message: clean(body.message),
  };
  for (const [field, [min, max]] of Object.entries(LIMITS) as [keyof Lead, readonly [number, number]][]) {
    const len = lead[field].length;
    if (len < min || len > max) return { error: `Invalid ${field}` };
  }
  if (!EMAIL_RE.test(lead.email)) return { error: 'Invalid email' };
  if (!PHONE_RE.test(lead.phone) || lead.phone.replace(/\D/g, '').length < 7) return { error: 'Invalid phone' };
  return { lead };
}

function formatMessage(lead: Lead, html: boolean): string {
  const e = html ? escapeHtml : (s: string) => s;
  const b = (s: string) => (html ? `<b>${s}</b>` : s);
  return [
    `🔔 ${b('פנייה חדשה מהאתר / New Website Inquiry')}`,
    '',
    `👤 ${b('שם / Name:')} ${e(lead.name)}`,
    `📧 ${b('אימייל / Email:')} ${e(lead.email)}`,
    `📱 ${b('טלפון / Phone:')} ${e(lead.phone)}`,
    `🔧 ${b('שירות / Service:')} ${e(lead.service || '—')}`,
    '',
    `📝 ${b('הודעה / Message:')}`,
    e(lead.message),
  ].join('\n');
}

async function sendTelegram(text: string, parseMode?: 'HTML'): Promise<boolean> {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      ...(parseMode ? { parse_mode: parseMode } : {}),
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(`[telegram] sendMessage failed (${res.status}${parseMode ? ', HTML' : ', plain'}): ${detail.slice(0, 300)}`);
  }
  return res.ok;
}

export async function POST(req: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing');
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 });
  }

  const limit = await rateLimit('contact', getClientIp(req.headers), { limit: 5, windowSec: 600 });
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429, headers: rateLimitHeaders(limit) });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Honeypot: real users never fill the hidden "website" field — pretend success
  if (typeof (body as Record<string, unknown>).website === 'string' && (body as Record<string, string>).website.trim() !== '') {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const unexpected = Object.keys(body).find((key) => !ALLOWED_FIELDS.has(key));
  if (unexpected) {
    return NextResponse.json({ error: `Unexpected field: ${unexpected.slice(0, 32)}` }, { status: 400 });
  }

  if (!verifyCsrfToken((body as Record<string, unknown>).csrfToken)) {
    return NextResponse.json({ error: 'Session expired. Please reload the page and try again.' }, { status: 403 });
  }

  const result = validate(body as Record<string, unknown>);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    let ok = await sendTelegram(formatMessage(result.lead, true), 'HTML');
    if (!ok) ok = await sendTelegram(formatMessage(result.lead, false)); // never lose a lead over formatting
    if (!ok) return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[telegram] send error', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }
}
