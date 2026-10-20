/**
 * Small provider interface for the optional free-tier AI (Layer 2).
 */
export type LlmProviderName = 'groq' | 'cloudflare' | 'gemini' | 'anthropic';

export interface LlmMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LlmRequest {
  system: string;
  messages: LlmMessage[];
  maxTokens: number;
  temperature: number;
  signal: AbortSignal;
}

export interface LlmProvider {
  name: LlmProviderName;
  /** Its keys are set (it can be used). */
  isConfigured(): boolean;
  /** The answer text. Throws LlmError on any failure (rate limit included). */
  complete(req: LlmRequest): Promise<string>;
}

export class LlmError extends Error {
  constructor(
    readonly provider: LlmProviderName,
    /** HTTP status, if any (429 = free quota / rate limit). */
    readonly status?: number,
  ) {
    super(`${provider} failed${status ? ` (HTTP ${status})` : ''}`);
  }
}
