import { NextResponse } from 'next/server';
import { LOCALES, isLocale } from '@/lib/i18n';
import { buildClientSearchDocs } from '@/lib/search/documents';

/**
 * Static, per-language search corpus for the home "Ask" box — generated at build
 * time, so instant results need no AI and no API key. The browser only loads it
 * when the visitor focuses the search box.
 */
export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(
    { docs: buildClientSearchDocs(lang) },
    { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } }
  );
}
