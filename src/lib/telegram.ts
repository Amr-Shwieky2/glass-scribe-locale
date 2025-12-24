/**
 * Telegram Bot API Integration
 * Sends contact form submissions to Telegram
 */

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

interface ContactFormData {
  name: string;
  phone: string;
  email?: string;
  message: string;
  language?: string;
}

/**
 * Send a message to Telegram
 * @param message - The message text to send
 * @returns Promise with the Telegram API response
 */
export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram configuration missing. Please set VITE_TELEGRAM_BOT_TOKEN and VITE_TELEGRAM_CHAT_ID in .env.local');
    return false;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}

/**
 * Format contact form data for Telegram message
 * @param data - Contact form data
 * @returns Formatted HTML message for Telegram
 */
export function formatContactFormMessage(data: ContactFormData): string {
  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Jerusalem',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  let message = `🔔 <b>New Contact Form Submission</b>\n\n`;
  message += `👤 <b>Name:</b> ${escapeHtml(data.name)}\n`;
  message += `📱 <b>Phone:</b> ${escapeHtml(data.phone)}\n`;
  
  if (data.email) {
    message += `📧 <b>Email:</b> ${escapeHtml(data.email)}\n`;
  }
  
  if (data.language) {
    message += `🌐 <b>Language:</b> ${data.language.toUpperCase()}\n`;
  }
  
  message += `\n💬 <b>Message:</b>\n${escapeHtml(data.message)}\n`;
  message += `\n⏰ <b>Time:</b> ${timestamp}`;

  return message;
}

/**
 * Escape HTML special characters for Telegram
 * @param text - Text to escape
 * @returns Escaped text
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Send contact form data to Telegram
 * @param data - Contact form data
 * @returns Promise indicating success or failure
 */
export async function sendContactFormToTelegram(data: ContactFormData): Promise<boolean> {
  const message = formatContactFormMessage(data);
  return await sendTelegramMessage(message);
}
