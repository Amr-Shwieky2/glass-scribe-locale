/**
 * Telegram Bot API - Send Message Endpoint
 * Receives contact form submissions and sends to Telegram bot
 * HIGH SECURITY: Rate limiting, input validation, honeypot, CSRF, suspicious pattern detection
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { timingSafeEqual, createHash, randomBytes } from 'crypto';

// =============================================================================
// INLINE SECURITY UTILITIES (for Vercel bundling)
// =============================================================================

const RATE_LIMITS = { 
  contact: { window: 60 * 1000, max: 3 },
  api: { window: 60 * 1000, max: 30 },
} as const;

const ALLOWED_ORIGINS = [
  'https://shwakiglassworks.com',
  'https://www.shwakiglassworks.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean);

function handleCORS(req: VercelRequest, res: VercelResponse): boolean {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  if (req.method === 'OPTIONS') { res.status(204).end(); return false; }
  return true;
}

function addSecurityHeaders(res: VercelResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
}

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return (req.headers['x-real-ip'] as string) || 'unknown';
}

function sanitizeString(input: unknown, maxLength = 1000): string {
  if (typeof input !== 'string') return '';
  if (input.length > maxLength * 2) return '';
  // eslint-disable-next-line no-control-regex
  const controlCharRegex = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
  return input
    .replace(/<[^>]*>/g, '').replace(/javascript:/gi, '').replace(/data:/gi, '')
    .replace(/vbscript:/gi, '').replace(/on\w+\s*=/gi, '').replace(/expression\s*\(/gi, '')
    .replace(controlCharRegex, '').replace(/[\u200B-\u200F\u2028-\u202F]/g, '')
    .trim().slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;
  const phoneRegex = /^[\d\s\-+()]{7,20}$/;
  return phoneRegex.test(phone);
}

const SUSPICIOUS_PATTERNS = [
  /(<script|<\/script|javascript:|data:|vbscript:)/gi,
  /(\$\{|\{\{|<%|%>|<\?)/gi,
  /(union\s+select|drop\s+table|delete\s+from|insert\s+into)/gi,
  // eslint-disable-next-line no-control-regex
  /(\.\.[\\/]|\x00)/gi,
];

function detectSuspiciousInput(input: string): boolean {
  if (typeof input !== 'string') return false;
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(input));
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, type: keyof typeof RATE_LIMITS = 'api'): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[type];
  const key = `${type}:${ip}`;
  const now = Date.now();
  if (Math.random() < 0.1) {
    for (const [k, v] of rateLimitStore.entries()) { if (now > v.resetTime) rateLimitStore.delete(k); }
  }
  const record = rateLimitStore.get(key);
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.window });
    return { allowed: true, remaining: config.max - 1, resetIn: config.window };
  }
  if (record.count >= config.max) return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  record.count++;
  return { allowed: true, remaining: config.max - record.count, resetIn: record.resetTime - now };
}

function addRateLimitHeaders(res: VercelResponse, limit: { remaining: number; resetIn: number }, max: number): void {
  res.setHeader('X-RateLimit-Limit', max.toString());
  res.setHeader('X-RateLimit-Remaining', Math.max(0, limit.remaining).toString());
  res.setHeader('X-RateLimit-Reset', Math.ceil(limit.resetIn / 1000).toString());
}

const CSRF_TOKEN_VALIDITY = 30 * 60 * 1000;
const csrfTokenStore = new Map<string, { token: string; expires: number }>();

function secureCompare(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const providedHash = createHash('sha256').update(provided).digest();
  const expectedHash = createHash('sha256').update(expected).digest();
  try { return timingSafeEqual(providedHash, expectedHash); } catch { return false; }
}

function validateCSRFToken(sessionId: string, providedToken: string): boolean {
  if (!providedToken || typeof providedToken !== 'string') return false;
  const stored = csrfTokenStore.get(sessionId);
  if (!stored) return false;
  if (Date.now() > stored.expires) { csrfTokenStore.delete(sessionId); return false; }
  const isValid = secureCompare(providedToken, stored.token);
  if (isValid) csrfTokenStore.delete(sessionId);
  return isValid;
}

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
    console.log(JSON.stringify({ event: 'rate_limit', ip: clientIP.slice(0, 16), endpoint: 'telegram/send' }));
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
      console.log(JSON.stringify({ event: 'blocked', ip: clientIP.slice(0, 16), reason: 'csrf_invalid', endpoint: 'telegram/send' }));
      return res.status(403).json({ error: 'Security validation failed. Please refresh and try again.' });
    }

    // Honeypot check - if website field is filled, it's a bot
    if (website && website.length > 0) {
      console.log(JSON.stringify({ event: 'blocked', ip: clientIP.slice(0, 16), reason: 'honeypot', endpoint: 'telegram/send' }));
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
      console.log(JSON.stringify({ event: 'invalid_input', ip: clientIP.slice(0, 16), reason: 'type_mismatch' }));
      return res.status(400).json({ error: 'Invalid input format' });
    }

    // Detect suspicious patterns (XSS, SQL injection, etc.)
    const allInputs = `${name} ${email} ${message} ${service || ''}`;
    if (detectSuspiciousInput(allInputs)) {
      console.log(JSON.stringify({ event: 'suspicious_input', ip: clientIP.slice(0, 16), endpoint: 'telegram/send' }));
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
      console.log(JSON.stringify({ event: 'blocked', ip: clientIP.slice(0, 16), reason: 'spam_content', endpoint: 'telegram/send' }));
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

      console.log(JSON.stringify({ event: 'contact_form_sent', ip: clientIP.slice(0, 16) }));
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
