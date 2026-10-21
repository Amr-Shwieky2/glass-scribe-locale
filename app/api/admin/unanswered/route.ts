import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminRequest } from '@/lib/admin-session';
import { groupMissedQuestions, listMissedQuestions } from '@/lib/missed-questions';

/** Admin → Unanswered questions: what the assistant couldn't answer, grouped by similarity. */
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await listMissedQuestions();
  return NextResponse.json(
    { total: items.length, groups: groupMissedQuestions(items) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
