/**
 * Telegram Bot API - Send Message Endpoint
 * Receives contact form submissions and sends to Telegram bot
 * HIGH SECURITY: Rate limiting, input validation, honeypot, CSRF, suspicious pattern detection
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  handleCORS,
  addSecurityHeaders,
  getClientIP,
  logSecurityEvent,
  checkRateLimit,
  addRateLimitHeaders,
  RATE_LIMITS,
  sanitizeString,
  isValidEmail,
  isValidPhone,
  detectSuspiciousInput,
  validateCSRFToken,
} from '../lib/security';

// =============================================================================
// CONFIGURATION
// =============================================================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Additional spam detection patterns
const SPAM_PATTERNS = [
  /\b(viagra|cialis|casino|lottery|winner|congratulations.*won|click here|act now)\b/gi,
  /\b(bitcoin|crypto.*invest|earn.*money|work.*home)\b/gi,
  /(http|https|www\.)[^\s]{20,}/gi, // Very long URLs
];

function containsSpam(text: string): boolean {
  return SPAM_PATTERNS.some(pattern => pattern.test(text));
}

// =============================================================================
// HANDLER
// =============================================================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add security headers
  addSecurityHeaders(res);
  
  // Handle CORS
  if (!handleCORS(req, res)) return;

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIP = getClientIP(req);

  // Check rate limit (strict for contact form)
  const rateLimit = checkRateLimit(clientIP, 'contact');
  addRateLimitHeaders(res, rateLimit, RATE_LIMITS.contact.max);
  
  if (!rateLimit.allowed) {
    logSecurityEvent('rate_limit', clientIP, { endpoint: 'telegram/send' });
    return res.status(429).json({ 
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(rateLimit.resetIn / 1000),
    });
  }

  try {
    const { name, email, phone, service, message, website, csrfToken } = req.body;

    // CSRF Token Validation
    const userAgent = req.headers['user-agent'] || '';
    const sessionId = `${clientIP}:${userAgent.slice(0, 50)}`;
    
    if (!csrfToken || !validateCSRFToken(sessionId, csrfToken)) {
      logSecurityEvent('blocked', clientIP, { reason: 'csrf_invalid', endpoint: 'telegram/send' });
      return res.status(403).json({ error: 'Security validation failed. Please refresh and try again.' });
    }

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      logSecurityEvent('blocked', clientIP, { reason: 'honeypot', endpoint: 'telegram/send' });
      // Return success to bot but don't actually send
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }

    // Validate required fields exist
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate input types
    if (typeof name !== 'string' || typeof email !== 'string' || 
        typeof phone !== 'string' || typeof message !== 'string') {
      logSecurityEvent('invalid_input', clientIP, { reason: 'type_mismatch' });
      return res.status(400).json({ error: 'Invalid input format' });
    }

    // Detect suspicious patterns (XSS, SQL injection, etc.)
    const allInputs = `${name} ${email} ${message} ${service || ''}`;
    if (detectSuspiciousInput(allInputs)) {
      logSecurityEvent('suspicious_input', clientIP, { endpoint: 'telegram/send' });
      return res.status(400).json({ error: 'Invalid characters detected' });
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeString(name, 100),
      email: sanitizeString(email, 254),
      phone: sanitizeString(phone, 20),
      service: sanitizeString(service || 'Not specified', 100),
      message: sanitizeString(message, 1000),
    };

    // Validate field lengths
    if (sanitizedData.name.length < 2 || sanitizedData.name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2-100 characters' });
    }
    if (!isValidEmail(sanitizedData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!isValidPhone(sanitizedData.phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }
    if (sanitizedData.message.length < 10 || sanitizedData.message.length > 1000) {
      return res.status(400).json({ error: 'Message must be between 10-1000 characters' });
    }

    // Check for spam content
    if (containsSpam(sanitizedData.message) || containsSpam(sanitizedData.name)) {
      logSecurityEvent('blocked', clientIP, { reason: 'spam_content', endpoint: 'telegram/send' });
      // Silent success for spam
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }

    // Check Telegram credentials
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram credentials not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Format message for Telegram (escape markdown special chars)
    const escapeMarkdown = (text: string): string => {
      return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&');
    };

    const telegramMessage = `
🔔 *פנייה חדשה מהאתר*
━━━━━━━━━━━━━━━━━━

👤 *שם:* ${escapeMarkdown(sanitizedData.name)}
📧 *אימייל:* ${escapeMarkdown(sanitizedData.email)}
📱 *טלפון:* ${escapeMarkdown(sanitizedData.phone)}
🛠️ *שירות:* ${escapeMarkdown(sanitizedData.service)}

💬 *הודעה:*
${escapeMarkdown(sanitizedData.message)}

━━━━━━━━━━━━━━━━━━
🕐 ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `.trim();

    // Send to Telegram with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    try {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'MarkdownV2',
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      const telegramResult = await telegramResponse.json();

      if (!telegramResponse.ok) {
        console.error('Telegram API error:', telegramResult);
        return res.status(500).json({ error: 'Failed to send message' });
      }

      logSecurityEvent('auth_success', clientIP, { action: 'contact_form_sent' });
      return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if ((fetchError as Error).name === 'AbortError') {
        console.error('Telegram request timeout');
        return res.status(504).json({ error: 'Request timeout' });
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error in telegram send:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
