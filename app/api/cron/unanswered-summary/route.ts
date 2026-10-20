import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { countMissedSince } from '@/lib/missed-questions';
import { getRedis, redisErrorSummary } from '@/lib/redis';
import { isTelegramConfigured, sendTelegramMessage } from '@/lib/telegram';

/**
 * Daily Telegram summary of new unanswered questions (Vercel Cron, vercel.json).
 * Runs only with CRON_SECRET set (Vercel sends it as a Bearer token) and can be
 * switched off with UNANSWERED_SUMMARY=off. Sends nothing when there is nothing new.
 * The last-run time moves forward only once a period is covered (nothing new, or
 * the message went out), so a failed read or send is counted again the next day.
 */
export const dynamic = 'force-dynamic';

const LAST_RUN_KEY = 'assistant:missed:summary-at';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (process.env.UNANSWERED_SUMMARY === 'off') return NextResponse.json({ skipped: 'off' });
  if (!isTelegramConfigured()) return NextResponse.json({ skipped: 'telegram not configured' });
  // Without Upstash the list lives in each serverless instance's memory: nothing to count here
  const redis = getRedis();
  if (!redis) return NextResponse.json({ skipped: 'no upstash' });

  const now = Date.now();
  let since: number;
  try {
    const last = Number(await redis.get<number | string>(LAST_RUN_KEY));
    since = last > 0 ? last : now - 86_400_000; // first run (no key): the last 24 hours
  } catch (err) {
    console.error('[unanswered-summary] Upstash error:', redisErrorSummary(err));
    return NextResponse.json({ error: 'Upstash read failed' }, { status: 503 });
  }
  const count = await countMissedSince(since, now);
  if (count === null) return NextResponse.json({ error: 'Upstash read failed' }, { status: 503 });

  const sent = count > 0 && await sendTelegramMessage(({ bold }) =>
    `🤖 ${bold(`${count} new unanswered question${count === 1 ? '' : 's'}`)} in the website assistant — see Admin → Unanswered questions.\n` +
    `${count} שאלות חדשות שהעוזר באתר לא ידע לענות עליהן — ראו בפאנל הניהול.`,
  );
  if (count === 0 || sent) {
    await redis.set(LAST_RUN_KEY, String(now)).catch((err) => console.error('[unanswered-summary] Upstash error:', redisErrorSummary(err)));
  }
  return NextResponse.json({ sent, count });
}
