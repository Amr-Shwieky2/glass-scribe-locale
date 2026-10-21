/**
 * Layer 2 of the website assistant: an OPTIONAL free-tier AI, used only when
 * our own answer engine (Layer 1) has no good answer.
 *
 * AI_PROVIDER selects it — "none" (default: no AI calls at all), "groq",
 * "cloudflare", "gemini", or a fallback chain like "groq,cloudflare" (on a rate
 * limit or failure the next one is tried). "anthropic" is a PAID adapter and is
 * used only if set explicitly. Providers without keys are skipped.
 *
 * Hard caps so it never costs money: 20 AI answers per IP per hour, a global
 * daily cap AI_DAILY_LIMIT (default 300, counted in Upstash — keep it below the
 * providers' free quotas; 0 turns the AI off), max_tokens 400, temperature 0.2, 8 s for the whole
 * provider chain. When a cap is hit or every provider fails, the caller falls
 * back to Layer 1/3; the visitor never sees an error.
 *
 * The AI is never the source of facts: it gets only the visitor's question (with
 * personal details removed), the last 4 turns and the best-matching knowledge
 * base entries and page passages, and its answer is checked (verify.ts) before use.
 */
import { CONTACT_INFO } from '@/data/contact';
import type { SupportedLocale } from '@/data/types';
import { answerFromEntry, searchKnowledge } from '@/lib/answer-engine';
import { THRESHOLDS } from '@/lib/answer-engine/config';
import type { ChatTurn } from '@/lib/chat-protocol';
import { rateLimit } from '@/lib/rate-limit';
import { buildChatSystemPrompt } from '@/lib/search/chat-prompt';
import { formatSiteContent, retrievePassages } from '@/lib/search/retrieve';
import { anthropic } from './anthropic';
import { cloudflare, gemini, groq } from './openai-compatible';
import { scrubPersonalData } from './privacy';
import { LlmError, type LlmMessage, type LlmProvider } from './types';
import { verifyAnswer } from './verify';

const PROVIDERS: Record<string, LlmProvider> = { groq, cloudflare, gemini, anthropic };

const PER_IP_PER_HOUR = 20;
const MAX_TOKENS = 400;
const TEMPERATURE = 0.2;
const TIMEOUT_MS = 8_000;
const HISTORY_TURNS = 4;

/** AI_DAILY_LIMIT: default 300; 0 turns the AI off. */
function dailyLimit(): number {
  const n = parseInt(process.env.AI_DAILY_LIMIT ?? '', 10);
  return Number.isFinite(n) && n >= 0 ? n : 300;
}

/** The configured providers, in AI_PROVIDER order ("none" or unset = none). */
export function providerChain(): LlmProvider[] {
  if (dailyLimit() === 0) return [];
  const names = (process.env.AI_PROVIDER || 'none').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (names.includes('none')) return [];
  return names.flatMap((n) => (PROVIDERS[n]?.isConfigured() ? [PROVIDERS[n]] : []));
}

/** Counts one AI answer against the per-IP and daily caps; false when a cap is reached. */
async function reserve(ip: string): Promise<boolean> {
  const perIp = await rateLimit('llm-ip', ip, { limit: PER_IP_PER_HOUR, windowSec: 3600 });
  if (!perIp.success) return false;
  const daily = await rateLimit('llm-daily', 'global', { limit: dailyLimit(), windowSec: 86400 });
  return daily.success;
}

/**
 * The best knowledge base entries and page passages for a question: as prompt
 * content, as plain text (what the answer must be about) and their links.
 */
function groundingFor(question: string, lang: SupportedLocale): { content: string; texts: string[]; urls: Set<string> } {
  const urls = new Set<string>();
  const texts: string[] = [];
  const entries = searchKnowledge(question, lang, 5)
    .filter((m) => m.confidence >= THRESHOLDS.groundingMin)
    .map((m, i) => {
      const reply = answerFromEntry(m.entry, lang);
      reply.links?.forEach((l) => urls.add(l.url));
      texts.push(m.entry.question[lang], reply.text);
      const links = reply.links?.map((l) => l.url).join(' ') ?? '';
      return `[K${i + 1}] Official answer\nQ: ${m.entry.question[lang]}\nA: ${reply.text}${links ? `\nLinks: ${links}` : ''}`;
    });
  const passages = retrievePassages(question, lang, 3);
  passages.forEach((p) => {
    if (p.url) urls.add(p.url);
    texts.push(p.title, p.text);
  });
  return {
    content: [`<knowledge>\n${entries.join('\n\n')}\n</knowledge>`, formatSiteContent(passages)].join('\n\n'),
    texts,
    urls,
  };
}

/** Last turns before the question, scrubbed, starting with a visitor turn. */
function historyMessages(history: ChatTurn[]): LlmMessage[] {
  let turns = history.slice(-HISTORY_TURNS);
  while (turns.length && turns[0].role === 'assistant') turns = turns.slice(1);
  return turns.map((t) => ({ role: t.role, content: scrubPersonalData(t.content).slice(0, 800) }));
}

/**
 * A short, checked AI answer grounded in our content — or null (no provider,
 * cap reached, every provider failed, or the answer failed the checks).
 */
export async function groundedAnswer(input: { question: string; history: ChatTurn[]; lang: SupportedLocale; ip: string }): Promise<string | null> {
  const chain = providerChain();
  if (!chain.length) return null;
  if (!(await reserve(input.ip))) return null;

  const question = scrubPersonalData(input.question);
  const { content, texts, urls } = groundingFor(question, input.lang);
  const system = buildChatSystemPrompt();
  const history = historyMessages(input.history);
  const messages: LlmMessage[] = [
    ...history,
    { role: 'user', content: `${content}\n\n<answer_language>${input.lang}</answer_language>\n<visitor_message>\n${question}\n</visitor_message>` },
  ];
  urls.add(`https://wa.me/${CONTACT_INFO.whatsapp.replace(/\D/g, '')}`);
  // The answer's numbers may also be ones the visitor wrote ("my shower is 90×190"); its topic must be the question and the retrieved content
  const visitorText = [...history.filter((m) => m.role === 'user').map((m) => m.content), question].join('\n');
  const allowedText = `${system}\n${content}\n${visitorText}`;
  const groundingText = [question, ...texts].join('\n');

  const deadline = Date.now() + TIMEOUT_MS; // one deadline for the whole chain
  for (const provider of chain) {
    const left = deadline - Date.now();
    if (left <= 0) break;
    let text: string;
    try {
      text = await provider.complete({ system, messages, maxTokens: MAX_TOKENS, temperature: TEMPERATURE, signal: AbortSignal.timeout(left) });
    } catch (err) {
      console.warn(JSON.stringify({ event: 'llm_failed', provider: provider.name, status: err instanceof LlmError ? err.status ?? null : null }));
      continue; // rate-limited, failed or cut off: try the next provider
    }
    const verdict = verifyAnswer(text, { lang: input.lang, allowedText, groundingText, allowedUrls: urls });
    if (verdict.ok) return verdict.text;
    console.warn(JSON.stringify({ event: 'llm_rejected', provider: provider.name, reason: verdict.reason }));
    return null; // a bad answer is not retried elsewhere (saves quota); Layer 1/3 answers instead
  }
  return null;
}
