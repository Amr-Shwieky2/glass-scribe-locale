/**
 * The website assistant's server pipeline, shared by /api/chat and /api/ask:
 *  Layer 1 — our own answer engine (src/lib/answer-engine): free, no external calls.
 *  Layer 2 — optional free-tier AI (src/lib/llm), only when Layer 1 has no good
 *            answer, AI_PROVIDER is set and the caps allow it.
 *  Layer 3 — our team: guided quote request, WhatsApp, call (always available).
 * Questions Layer 1 couldn't answer with a specific entry are kept (anonymized) for Admin → Unanswered questions,
 * saved after the response is sent so they never slow the answer down.
 * Privacy: conversations are not stored; logs hold only event, language, layer and message count.
 */
import { after } from 'next/server';
import type { SupportedLocale } from '@/data/types';
import { answerEntry, answerMessage, type EngineResult } from '@/lib/answer-engine';
import type { AssistantReply, ChatTurn } from '@/lib/chat-protocol';
import { groundedAnswer } from '@/lib/llm';
import { recordMissedQuestion } from '@/lib/missed-questions';
import { rateLimit } from '@/lib/rate-limit';
import { ASSISTANT_REPLIES } from '@/data/assistant-replies';

/** Layer 1 is free, but one IP can't flood the server. */
const PER_IP_PER_HOUR = 150;

function toWire({ confidence: _c, reason: _r, ...reply }: EngineResult): AssistantReply {
  return reply;
}

function handOff(lang: SupportedLocale): AssistantReply {
  return { kind: 'none', lang, text: ASSISTANT_REPLIES.notSure[lang], actions: ['quote', 'whatsapp', 'call'], layer: 3 };
}

/** Runs best-effort work once the response is sent; outside a request (scripts) it starts right away, not awaited. */
function afterResponse(task: () => Promise<void>): void {
  try {
    after(task);
  } catch {
    task().catch(() => {});
  }
}

export async function assistantReply(input: {
  message: string;
  lang: SupportedLocale;
  history: ChatTurn[];
  ip: string;
  surface: 'chat' | 'ask';
}): Promise<AssistantReply> {
  const allowed = await rateLimit(`assistant-${input.surface}`, input.ip, { limit: PER_IP_PER_HOUR, windowSec: 3600 });
  if (!allowed.success) return handOff(input.lang);

  const result = answerMessage({ message: input.message, pageLocale: input.lang, history: input.history });
  let reply: AssistantReply = toWire(result);

  if (result.kind === 'none') {
    if (result.reason === 'low-confidence') {
      const text = await groundedAnswer({ question: input.message, history: input.history, lang: result.lang, ip: input.ip }).catch(() => null);
      if (text) reply = { kind: 'answer', lang: result.lang, text, actions: ['quote', 'whatsapp'], layer: 2 };
    }
    const missed = { text: input.message, lang: result.lang, layer: reply.layer === 2 ? 2 : 3, reason: result.reason ?? 'low-confidence' } as const;
    afterResponse(() => recordMissedQuestion(missed));
  } else if (result.kind === 'suggest' || result.reason === 'price-general') {
    // Answered by Layer 1, but not with a specific entry: worth a look too
    const missed = { text: input.message, lang: result.lang, layer: 1, reason: result.kind === 'suggest' ? 'did-you-mean' : 'price-general' } as const;
    afterResponse(() => recordMissedQuestion(missed));
  }

  console.log(JSON.stringify({ event: `assistant_${input.surface}`, lang: reply.lang, layer: reply.layer, kind: reply.kind, messages: input.history.length + 1 }));
  return reply;
}

/** A "Did you mean" / related question button. */
export function entryReply(id: string, lang: SupportedLocale): AssistantReply | null {
  const result = answerEntry(id, lang);
  return result ? toWire(result) : null;
}
