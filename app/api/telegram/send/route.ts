import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json({ error: 'Telegram credentials missing' }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { text, name, email, phone, service, message } = body;

    let messageText: string;
    if (text) {
      messageText = text;
    } else if (name && email && phone && message) {
      messageText = [
        '🔔 <b>פנייה חדשה מהאתר / New Website Inquiry</b>',
        '',
        `👤 <b>שם / Name:</b> ${name}`,
        `📧 <b>אימייל / Email:</b> ${email}`,
        `📱 <b>טלפון / Phone:</b> ${phone}`,
        `🔧 <b>שירות / Service:</b> ${service || '—'}`,
        '',
        `📝 <b>הודעה / Message:</b>`,
        message,
      ].join('\n');
    } else {
      return NextResponse.json({ error: 'Message text required' }, { status: 400 });
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: messageText,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Telegram API error' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
