/**
 * Telegram Bot API - Send Message Endpoint
 * Receives contact form submissions and sends to Telegram bot
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Security: Rate limiting (simple in-memory, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // Max requests per IP
const RATE_WINDOW = 60 * 1000; // 1 minute

// Security: Input validation
const sanitizeInput = (input: string, maxLength = 1000): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, maxLength);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  return phoneRegex.test(phone);
};

// Get client IP for rate limiting
const getClientIP = (req: VercelRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
};

// Check rate limit
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check rate limit
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const { name, email, phone, service, message, website } = req.body;

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      // Return success to bot but don't actually send
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name, 100),
      email: sanitizeInput(email, 254),
      phone: sanitizeInput(phone, 20),
      service: sanitizeInput(service || 'Not specified', 100),
      message: sanitizeInput(message, 1000),
    };

    // Validate formats
    if (sanitizedData.name.length < 2) {
      return res.status(400).json({ error: 'Name too short' });
    }
    if (!isValidEmail(sanitizedData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!isValidPhone(sanitizedData.phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }
    if (sanitizedData.message.length < 10) {
      return res.status(400).json({ error: 'Message too short' });
    }

    // Get Telegram credentials from environment
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Format message for Telegram
    const telegramMessage = `
🔔 *פנייה חדשה מהאתר*
━━━━━━━━━━━━━━━━━━

👤 *שם:* ${sanitizedData.name}
📧 *אימייל:* ${sanitizedData.email}
📱 *טלפון:* ${sanitizedData.phone}
🛠️ *שירות:* ${sanitizedData.service}

💬 *הודעה:*
${sanitizedData.message}

━━━━━━━━━━━━━━━━━━
🕐 ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `.trim();

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult);
      return res.status(500).json({ error: 'Failed to send message' });
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error in telegram send:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
