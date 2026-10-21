import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isLocale } from '@/lib/i18n';
import { isSameOrigin } from '@/lib/ai';
import { assistantReply, entryReply } from '@/lib/assistant';
import { CHAT_LIMITS, type ChatTurn } from '@/lib/chat-protocol';
import { getClientIp } from '@/lib/rate-limit';
import { cleanText, readJsonBody } from '@/lib/validation';
import type { SupportedLocale } from '@/data/types';

/**
 * Site-wide chat assistant (see src/lib/assistant.ts for the layers).
 * POST { messages, lang } → answer to the last visitor message
 * POST { entryId, lang }  → a "Did you mean" / related question button
 * Always { reply } with status 200 for valid requests — no error ever reaches the visitor.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 64 * 1024;
const ENTRY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type Parsed =
  | { messages: ChatTurn[]; lang: SupportedLocale }
  | { entryId: string; lang: SupportedLocale }
  | { error: string };

/** Validates the request; keeps at most the last 12 messages (starting with a visitor message). */
function parseRequest(body: unknown): Parsed {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Invalid request' };
  const { messages, lang, entryId, ...rest } = body as Record<string, unknown>;
  if (Object.keys(rest).length) return { error: 'Unexpected field' };
  if (lang !== undefined && (typeof lang !== 'string' || !isLocale(lang))) return { error: 'Invalid lang' };
  const locale = (lang as SupportedLocale | undefined) ?? 'he';

  if (entryId !== undefined) {
    if (messages !== undefined || typeof entryId !== 'string' || entryId.length > 80 || !ENTRY_ID.test(entryId)) return { error: 'Invalid entryId' };
    return { entryId, lang: locale };
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) return { error: 'Invalid messages' };
  const turns: ChatTurn[] = [];
  for (const [i, m] of messages.entries()) {
    if (!m || typeof m !== 'object' || Array.isArray(m)) return { error: 'Invalid message' };
    const { role, content, ...extra } = m as Record<string, unknown>;
    if (Object.keys(extra).length) return { error: 'Invalid message' };
    if (role !== 'user' && role !== 'assistant') return { error: 'Invalid role' };
    const text = cleanText(content);
    if (!text) return { error: 'Empty message' };
    if (role === 'user' && text.length > CHAT_LIMITS.maxUserChars) return { error: 'Message too long' };
    if (role === 'assistant' && text.length > CHAT_LIMITS.maxAssistantChars) return { error: 'Message too long' };
    const expected = i % 2 === 0 ? 'user' : 'assistant';
    if (role !== expected) return { error: 'Roles must alternate, starting with the visitor' };
    turns.push({ role, content: text });
  }
  if (turns[turns.length - 1].role !== 'user') return { error: 'Last message must be from the visitor' };

  let kept = turns.slice(-CHAT_LIMITS.maxMessages);
  if (kept[0].role === 'assistant') kept = kept.slice(1);
  return { messages: kept, lang: locale };
}

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return json({ error: 'Forbidden' }, 403);
  const body = await readJsonBody(req, MAX_BODY_BYTES);
  if (body.tooLarge) return json({ error: 'Request too large' }, 413);

  const parsed = parseRequest(body.value);
  if ('error' in parsed) return json({ error: parsed.error }, 400);

  if ('entryId' in parsed) {
    const reply = entryReply(parsed.entryId, parsed.lang);
    return reply ? json({ reply }) : json({ error: 'Unknown entry' }, 404);
  }

  const { messages, lang } = parsed;
  const reply = await assistantReply({
    message: messages[messages.length - 1].content,
    history: messages.slice(0, -1),
    lang,
    ip: getClientIp(req.headers),
    surface: 'chat',
  });
  return json({ reply });
}
