/**
 * Telegram notifications (contact form + chat quote requests). Server-only.
 *
 * Messages are rendered twice from the same template: first as Telegram HTML
 * (bold labels, every user value escaped), and — if Telegram rejects that —
 * again as plain text, so a lead is never lost over formatting.
 */

export interface TelegramFormatter {
  /** Bold label (only in the HTML rendering). */
  bold(text: string): string;
  /** A user-supplied value: HTML-escaped in the HTML rendering, as-is in plain text. */
  value(text: string): string;
}

export function escapeTelegramHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const HTML: TelegramFormatter = { bold: (s) => `<b>${s}</b>`, value: escapeTelegramHtml };
const PLAIN: TelegramFormatter = { bold: (s) => s, value: (s) => s };

export function isTelegramConfigured(): boolean {
  return !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

async function post(text: string, parseMode?: 'HTML'): Promise<boolean> {
  const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
      ...(parseMode ? { parse_mode: parseMode } : {}),
      disable_web_page_preview: true,
    }),
    // Don't let a stalled Telegram API hold the visitor's request open
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) {
    // Status and Telegram's numeric code only — the description can echo message text
    const code = await res.json().then((d: { error_code?: number }) => d.error_code).catch(() => undefined);
    console.error(`[telegram] sendMessage failed (${res.status}${code ? `/${code}` : ''}, ${parseMode ? 'HTML' : 'plain'})`);
  }
  return res.ok;
}

/**
 * Sends one message built by `render`. Tries HTML, then retries once as plain
 * text. Returns true when Telegram accepted one of the two (never both).
 */
export async function sendTelegramMessage(render: (f: TelegramFormatter) => string): Promise<boolean> {
  if (!isTelegramConfigured()) {
    console.error('[telegram] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID missing');
    return false;
  }
  try {
    if (await post(render(HTML), 'HTML')) return true;
  } catch (err) {
    console.error('[telegram] HTML send error', err);
  }
  try {
    return await post(render(PLAIN));
  } catch (err) {
    console.error('[telegram] plain send error', err);
    return false;
  }
}
