'use client';
/**
 * Admin → Unanswered questions: what visitors asked the website assistant that
 * our knowledge base doesn't answer yet, grouped by similarity
 * (GET /api/admin/unanswered). "Copy list" copies them as plain text, every
 * wording included, ready to send for new knowledge base entries.
 */
import { useCallback, useEffect, useState, type FC } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ADMIN_STRINGS, getAdminText, type AdminLocale } from '@/data/admin-strings';
import type { MissedQuestionGroup } from '@/lib/missed-questions';

interface Props {
  locale: AdminLocale;
}

/** Other wordings shown per group ("Copy list" copies all of them). */
const SHOWN_SAMPLES = 5;

const UnansweredQuestions: FC<Props> = ({ locale }) => {
  const t = (strings: Record<string, string>) => getAdminText(strings, locale);
  const S = ADMIN_STRINGS.unanswered;
  const [data, setData] = useState<{ total: number; groups: MissedQuestionGroup[] } | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await fetch('/api/admin/unanswered', { cache: 'no-store', credentials: 'same-origin' });
      if (!res.ok) throw new Error(String(res.status));
      setData(await res.json());
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const copy = async () => {
    if (!data) return;
    const text = data.groups
      .map((g) => [`(${g.count}×, ${g.langs.join('/')}) ${g.example}`, ...g.samples.map((x) => `    - ${x}`)].join('\n'))
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section aria-labelledby="unanswered-title">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 id="unanswered-title" className="text-xl font-bold text-brand-navy">{t(ADMIN_STRINGS.tabs.unanswered)}</h2>
          <p className="text-sm text-brand-navy/70 max-w-2xl">{t(S.intro)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}>{t(S.refresh)}</Button>
          <Button onClick={copy} disabled={!data?.groups.length} className="bg-brand-navy hover:bg-brand-navy/90 text-white">
            {copied ? t(S.copied) : t(S.copy)}
          </Button>
        </div>
      </div>

      {error && <p role="alert" className="text-red-700">{t(S.loadError)}</p>}
      {data && (
        <p className="text-sm text-brand-navy/70 mb-3">{t(S.total)}: {data.total}</p>
      )}
      {data && data.groups.length === 0 && (
        <Card><CardContent className="py-10 text-center text-brand-navy/70">{t(S.empty)}</CardContent></Card>
      )}
      {data && data.groups.length > 0 && (
        <ul className="space-y-3">
          {data.groups.map((g, i) => (
            <li key={i}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 rounded-full bg-brand-gold/20 px-2.5 py-1 text-sm font-bold text-brand-navy">{g.count} {t(S.times)}</span>
                    <div className="min-w-0 flex-1">
                      <p dir="auto" className="font-medium text-brand-navy break-words">{g.example}</p>
                      <p className="mt-1 text-xs text-brand-navy/60">
                        {g.langs.join(' · ')} · {new Date(g.lastAt).toLocaleString(locale === 'he' ? 'he-IL' : locale)}
                        {g.answeredByAi > 0 && ` · ${g.answeredByAi} ${t(S.answeredByAi)}`}
                        {g.outOfScope > 0 && ` · ${g.outOfScope} ${t(S.outOfScope)}`}
                        {g.didYouMean > 0 && ` · ${g.didYouMean} ${t(S.didYouMean)}`}
                        {g.priceGeneral > 0 && ` · ${g.priceGeneral} ${t(S.priceGeneral)}`}
                      </p>
                      {g.samples.length > 0 && (
                        <div className="mt-2 text-sm text-brand-navy/80">
                          <span className="font-semibold">{t(S.alsoAsked)}</span>
                          <ul className="mt-1 list-disc ps-5 space-y-0.5">
                            {g.samples.slice(0, SHOWN_SAMPLES).map((x) => <li key={x} dir="auto" className="break-words">{x}</li>)}
                            {g.samples.length > SHOWN_SAMPLES && <li className="list-none text-brand-navy/60">+{g.samples.length - SHOWN_SAMPLES}</li>}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default UnansweredQuestions;
