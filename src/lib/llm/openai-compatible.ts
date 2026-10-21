/**
 * Free-tier providers with an OpenAI-compatible chat API — plain fetch, no SDK:
 *  - Groq (free tier):                   GROQ_API_KEY, GROQ_MODEL
 *  - Cloudflare Workers AI (free daily allocation): CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, CLOUDFLARE_MODEL
 *  - Google AI Studio / Gemini (free tier): GEMINI_API_KEY, GEMINI_MODEL.
 *    Free-tier content may be used by Google to improve its products — send no personal data
 *    (the caller scrubs phone numbers, emails and names first; quote details are never sent).
 * None of these can charge money as long as billing is not enabled on the account.
 */
import { LlmError, type LlmProvider, type LlmProviderName, type LlmRequest } from './types';

async function chatCompletion(
  name: LlmProviderName,
  url: string,
  key: string,
  model: string,
  req: LlmRequest,
  /** Provider-specific request fields. */
  extra: Record<string, unknown> = {},
): Promise<string> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: req.system }, ...req.messages],
        max_tokens: req.maxTokens,
        temperature: req.temperature,
        stream: false,
        ...extra,
      }),
      signal: req.signal,
    });
  } catch {
    throw new LlmError(name); // network error or timeout
  }
  if (!res.ok) throw new LlmError(name, res.status);
  const data = (await res.json().catch(() => null)) as { choices?: { message?: { content?: unknown }; finish_reason?: unknown }[] } | null;
  const choice = data?.choices?.[0];
  const text = choice?.message?.content;
  // Cut off at max_tokens ("length"): half an answer is not shown
  if (typeof text !== 'string' || choice?.finish_reason === 'length') throw new LlmError(name, res.status);
  return text;
}

export const groq: LlmProvider = {
  name: 'groq',
  isConfigured: () => !!process.env.GROQ_API_KEY,
  complete: (req) =>
    chatCompletion('groq', 'https://api.groq.com/openai/v1/chat/completions', process.env.GROQ_API_KEY!, process.env.GROQ_MODEL || 'llama-3.3-70b-versatile', req),
};

export const cloudflare: LlmProvider = {
  name: 'cloudflare',
  isConfigured: () => !!(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN),
  complete: (req) =>
    chatCompletion(
      'cloudflare',
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(process.env.CLOUDFLARE_ACCOUNT_ID!)}/ai/v1/chat/completions`,
      process.env.CLOUDFLARE_API_TOKEN!,
      process.env.CLOUDFLARE_MODEL || '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      req,
    ),
};

/**
 * Free-tier content may be used by Google to improve its products — send no personal data.
 * Thinking is turned off: Gemini 2.5 Flash thinks by default, and thinking tokens count
 * against max_tokens (the answer would be cut off or empty).
 */
export const gemini: LlmProvider = {
  name: 'gemini',
  isConfigured: () => !!process.env.GEMINI_API_KEY,
  complete: (req) =>
    chatCompletion(
      'gemini',
      'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
      process.env.GEMINI_API_KEY!,
      process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      req,
      { reasoning_effort: 'none' },
    ),
};
