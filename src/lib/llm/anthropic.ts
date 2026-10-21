/**
 * Optional PAID adapter (Anthropic). Used only when AI_PROVIDER explicitly
 * includes "anthropic" — never by default. The SDK is loaded on first use.
 */
import { LlmError, type LlmProvider } from './types';

export const anthropic: LlmProvider = {
  name: 'anthropic',
  isConfigured: () => !!process.env.ANTHROPIC_API_KEY,
  async complete(req) {
    const model = process.env.AI_CHAT_MODEL || 'claude-haiku-5-5';
    try {
      const { default: Anthropic } = await import('@anthropic-ai/sdk');
      const client = new Anthropic({ maxRetries: 0, timeout: 8_000 });
      const message = await client.messages.create(
        {
          model,
          max_tokens: req.maxTokens,
          system: req.system,
          messages: req.messages,
          // Short answers: no extended thinking on Haiku, low effort. (No sampling parameters: Haiku 5.5 rejects them.)
          ...(model.startsWith('claude-haiku') ? { thinking: { type: 'disabled' as const } } : {}),
          output_config: { effort: 'low' as const },
        },
        { signal: req.signal },
      );
      if (message.stop_reason === 'max_tokens') throw new LlmError('anthropic'); // cut off: half an answer is not shown
      return message.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('');
    } catch (err) {
      if (err instanceof LlmError) throw err;
      const status = typeof (err as { status?: unknown }).status === 'number' ? (err as { status: number }).status : undefined;
      throw new LlmError('anthropic', status);
    }
  },
};
