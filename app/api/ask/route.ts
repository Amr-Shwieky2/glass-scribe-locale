import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLocale } from '@/lib/i18n';
import { isSameOrigin } from '@/lib/ai';
import { assistantReply, entryReply } from '@/lib/assistant';
import { getClientIp } from '@/lib/rate-limit';
import { cleanText } from '@/lib/validation';

/**
 * "Ask AI" box on the home page — the same assistant as the chat
 * (src/lib/assistant.ts): our own answer engine first, free-tier AI only if
 * configured, hand-off otherwise.
 * POST { question, lang } | { entryId, lang } → { reply }
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_QUESTION = 300;
const ENTRY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ error: 'Forbidden' }, 403);

  const body = (await req.json().catch(() => null)) as { question?: unknown; lang?: unknown; entryId?: unknown } | null;
  const lang = typeof body?.lang === 'string' && isLocale(body.lang) ? body.lang : 'he';

  if (typeof body?.entryId === 'string') {
    if (!ENTRY_ID.test(body.entryId) || body.entryId.length > 80) return json({ error: 'Invalid entryId' }, 400);
    const reply = entryReply(body.entryId, lang);
    return reply ? json({ reply }) : json({ error: 'Unknown entry' }, 404);
  }

  const question = cleanText(body?.question).replace(/\s+/g, ' ');
  if (question.length < 2) return json({ error: 'Question required' }, 400);
  if (question.length > MAX_QUESTION) return json({ error: 'Question too long' }, 400);

  const reply = await assistantReply({ message: question, history: [], lang, ip: getClientIp(req.headers), surface: 'ask' });
  return json({ reply });
}
