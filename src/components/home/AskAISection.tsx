'use client';
/**
 * "Ask AI" search (home page).
 *  - Instant results from our own content while typing: a static per-language
 *    index (/api/search-index/[lang]) searched in the browser.
 *  - Enter / "Ask": an answer from the website assistant (/api/ask — our own
 *    answer engine first; see src/lib/assistant.ts) with links, "Did you mean…?"
 *    options, and a hand-off to our team (free quote in the chat, WhatsApp, call).
 *  - "Popular questions" (and FAQ entries among the instant results) open the
 *    chat with our official answer, shown at once without a request.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, MessageCircle, Phone, Loader2, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { trackEvent } from '@/lib/gtag';
import { getLoadedSiteSearch, loadSiteSearch, searchSite, type SiteHit } from '@/lib/search/client';
import type { AiSearchStrings } from '@/data/ai-search';
import { loadChatPanel, openChat } from '@/components/chat/chat-events';
import type { QuestionAnswer } from '@/data/faq';
import type { SupportedLocale } from '@/data/types';
import type { AssistantReply, ReplySuggestion } from '@/lib/chat-protocol';

interface AskAISectionProps {
  id?: string;
  locale: SupportedLocale;
  strings: AiSearchStrings;
  /** Label of the button that continues the answer in the site chat. */
  continueInChatLabel: string;
  /** Popular FAQ questions with their official answers. */
  popularQuestions: QuestionAnswer[];
  whatsapp: string;
  phoneIntl: string;
}

type Hit = SiteHit;
type AnswerState =
  | { status: 'idle' }
  | { status: 'loading'; question: string }
  | { status: 'done'; question: string; reply: AssistantReply };

const MAX_QUESTION = 300;

/** Renders plain text with [title](/internal-url) links; anything else stays text. */
function AnswerText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]\n]{1,120})\]\((\/[^)\s]{0,200})\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const href = m[2];
    parts.push(
      href.startsWith('//') ? (
        m[1]
      ) : (
        <Link key={m.index} href={href} className="font-semibold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-4 hover:text-brand-gold">
          {m[1]}
        </Link>
      )
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <p className="whitespace-pre-line leading-relaxed text-gray-700 text-base sm:text-lg">{parts}</p>;
}

const AskAISection: React.FC<AskAISectionProps> = ({ id, locale, strings, continueInChatLabel, popularQuestions, whatsapp, phoneIntl }) => {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [answer, setAnswer] = useState<AnswerState>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const Arrow = locale === 'he' || locale === 'ar' ? ArrowLeft : ArrowRight;

  // The library and the index load only once the visitor starts using the box
  const loadIndex = useCallback(() => loadSiteSearch(locale), [locale]);

  // Instant results while typing (debounced)
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      const ms = getLoadedSiteSearch(locale) ?? (await loadIndex());
      if (!ms) return;
      setHits(searchSite(ms, q, 5));
    }, 120);
    return () => clearTimeout(t);
  }, [query, locale, loadIndex]);

  useEffect(() => () => abortRef.current?.abort(), []);

  /** One request to the assistant; any failure becomes our hand-off reply (never an error). */
  const request = useCallback(async (body: object, question: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAnswer({ status: 'loading', question });
    const handOff: AssistantReply = { kind: 'none', lang: locale, text: strings.notSure, actions: ['quote', 'whatsapp', 'call'], layer: 3 };
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => null)) as { reply?: AssistantReply } | null;
      const reply = res.ok && data?.reply?.text ? data.reply : handOff;
      setAnswer({ status: 'done', question, reply });
      trackEvent({ action: 'ai_search_reply', category: 'AI Search', label: `${reply.kind}-L${reply.layer}` });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setAnswer({ status: 'done', question, reply: handOff });
    }
  }, [locale, strings.notSure]);

  const ask = useCallback((raw: string) => {
    const question = raw.trim().slice(0, MAX_QUESTION);
    if (question.length < 2) return;
    trackEvent({ action: 'ai_search_question', category: 'AI Search', label: locale });
    request({ question, lang: locale }, question);
  }, [locale, request]);

  /** A "Did you mean" option or related question: its answer. */
  const askEntry = (suggestion: ReplySuggestion, lang: SupportedLocale) => {
    trackEvent({ action: 'ai_search_suggestion_clicked', category: 'AI Search', label: locale });
    request({ entryId: suggestion.id, lang }, suggestion.question);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(query);
  };

  /** An official FAQ answer, shown in the chat at once (no AI call); the visitor can continue from there. */
  const showOfficialAnswer = (question: string, answer: string) => {
    trackEvent({ action: 'chat_popular_question_clicked', category: 'AI Chat', label: locale });
    openChat({ question, answer, faq: true });
  };

  const askedQuestion = answer.status === 'idle' ? '' : answer.question;
  const whatsappHref = `https://wa.me/${whatsapp.replace('+', '')}?text=${encodeURIComponent(`${strings.whatsappPrefix} ${askedQuestion || query}`.trim())}`;
  const busy = answer.status === 'loading';
  const reply = answer.status === 'done' ? answer.reply : null;
  const handOff = !!reply && (reply.kind === 'none' || reply.kind === 'quote');
  const offerQuote = !!reply && (handOff || !!reply.actions?.includes('quote'));
  const openQuote = () => {
    trackEvent({ action: 'ai_search_quote_click', category: 'AI Search', label: locale });
    openChat({ quote: true, ...reply?.quotePrefill });
  };

  return (
    <section id={id} aria-labelledby="ask-ai-title" className="scroll-mt-16 sm:scroll-mt-20 py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6 sm:mb-8" data-reveal>
            <div className="inline-flex items-center justify-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>AI</span>
            </div>
            <h2 id="ask-ai-title" className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-3">
              {strings.title}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">{strings.subtitle}</p>
          </div>

          {/* Search box */}
          <form role="search" onSubmit={onSubmit} className="relative" aria-label={strings.title}>
            <label htmlFor="ask-ai-input" className="sr-only">{strings.inputLabel}</label>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-brand-navy/10 bg-white shadow-lg focus-within:border-brand-gold focus-within:ring-4 focus-within:ring-brand-gold/20 transition-all ps-4 pe-2 py-2">
              <Sparkles className="w-6 h-6 text-brand-gold flex-shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                id="ask-ai-input"
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                maxLength={MAX_QUESTION}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { loadIndex(); }}
                placeholder={strings.placeholder}
                className="flex-1 min-w-0 bg-transparent py-3 text-base sm:text-lg text-brand-navy placeholder:text-gray-400"
                // The wrapper's focus-within ring is the focus indicator; drop the global :focus-visible outline here
                style={{ outline: 'none' }}
                aria-describedby="ask-ai-hint"
              />
              <button
                type="submit"
                disabled={busy || query.trim().length < 2}
                className="btn-animated-gold-filled inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Search className="w-5 h-5" aria-hidden="true" />}
                <span>{strings.ask}</span>
              </button>
            </div>
            <p id="ask-ai-hint" className="sr-only">{strings.subtitle}</p>
          </form>

          {/* Popular questions — official FAQ answers, opened in the chat */}
          <div className="mt-5" aria-labelledby="ask-ai-popular" role="group">
            <p id="ask-ai-popular" className="mb-2 text-center text-sm font-medium text-gray-600">{strings.suggestionsLabel}</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {popularQuestions.map((qa) => (
                <li key={qa.question}>
                  <button
                    type="button"
                    onClick={() => showOfficialAnswer(qa.question, qa.answer)}
                    onPointerEnter={loadChatPanel}
                    onFocus={loadChatPanel}
                    aria-haspopup="dialog"
                    className="rounded-full border border-brand-navy/15 bg-brand-light px-4 py-2 text-sm text-brand-navy hover:border-brand-gold hover:bg-brand-gold/10 transition-colors focus-visible:outline-brand-navy"
                  >
                    {qa.question}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Instant results from the site (no AI) */}
          {query.trim().length >= 2 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">{strings.instantResults}</h3>
              {hits.length > 0 ? (
                <ul className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                  {hits.map((hit) => {
                    const content = (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">{hit.title}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{hit.snippet}</p>
                        </div>
                        <Arrow className="w-4 h-4 mt-1 text-gray-400 group-hover:text-brand-gold flex-shrink-0" aria-hidden="true" />
                      </>
                    );
                    const itemClass = 'group flex w-full items-start gap-3 p-4 text-start hover:bg-brand-light transition-colors focus-visible:outline-brand-navy focus-visible:-outline-offset-2';
                    return (
                      <li key={hit.id}>
                        {/* FAQ entries have no section to link to: their official answer opens in the chat */}
                        {hit.answer ? (
                          <button type="button" onClick={() => showOfficialAnswer(hit.title, hit.answer!)} aria-haspopup="dialog" className={itemClass}>
                            {content}
                          </button>
                        ) : (
                          <Link href={hit.url} className={itemClass}>
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">{strings.noResults}</p>
              )}
            </div>
          )}

          {/* Answer */}
          <div aria-live="polite" aria-busy={busy} className="mt-6">
            {answer.status !== 'idle' && (
              <div className="rounded-2xl border border-gray-100 border-s-4 border-s-brand-gold bg-white shadow-lg p-5 sm:p-6">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-gold mb-3">
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  {strings.answerLabel}
                </p>

                {answer.status === 'loading' && (
                  <p className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    {strings.thinking}
                  </p>
                )}

                {reply && (
                  <>
                    <div dir="auto"><AnswerText text={reply.text} /></div>

                    {!!reply.links?.length && (
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-600">{strings.usefulPages}</p>
                        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          {reply.links.map((l) => (
                            <li key={l.url}>
                              <Link href={l.url} className="font-semibold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-4 hover:text-brand-gold">
                                {l.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!!reply.suggestions?.length && (
                      <div className="mt-4" role="group" aria-label={reply.kind === 'suggest' ? reply.text : strings.relatedQuestions}>
                        {reply.kind !== 'suggest' && <p className="text-sm font-semibold text-gray-600">{strings.relatedQuestions}</p>}
                        <ul className="mt-1 flex flex-wrap gap-2">
                          {reply.suggestions.map((sug) => (
                            <li key={sug.id}>
                              <button
                                type="button"
                                onClick={() => askEntry(sug, reply.lang)}
                                className="rounded-full border border-brand-navy/15 bg-brand-light px-4 py-2 text-start text-sm text-brand-navy hover:border-brand-gold hover:bg-brand-gold/10 transition-colors focus-visible:outline-brand-navy"
                              >
                                {sug.question}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-5 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                      {offerQuote && (
                        <button
                          type="button"
                          onClick={openQuote}
                          onPointerEnter={loadChatPanel}
                          aria-haspopup="dialog"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-base font-semibold text-white hover:bg-[#143a5e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                        >
                          <FileText className="w-5 h-5 text-brand-gold" aria-hidden="true" />
                          {strings.getQuote}
                        </button>
                      )}
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent({ action: 'ai_search_whatsapp_click', category: 'AI Search', label: locale })}
                        className="btn-animated-gold-filled inline-flex items-center justify-center gap-2 px-6 py-3 text-base"
                      >
                        <MessageCircle className="w-5 h-5" aria-hidden="true" />
                        {strings.whatsappCta}
                      </a>
                      <a
                        href={`tel:${phoneIntl}`}
                        onClick={() => trackEvent({ action: 'ai_search_call_click', category: 'AI Search', label: locale })}
                        className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-navy px-6 py-3 text-base font-semibold text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                      >
                        <Phone className="w-5 h-5" aria-hidden="true" />
                        {strings.callCta}
                      </a>
                    </div>

                    {reply.kind === 'answer' && (
                      <button
                        type="button"
                        onClick={() => openChat({ question: answer.question, answer: reply.text })}
                        className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#143a5e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                      >
                        <MessageCircle className="w-4 h-4 text-brand-gold" aria-hidden="true" />
                        {continueInChatLabel}
                      </button>
                    )}
                    {/* Only free-tier AI answers (layer 2) carry the "may contain mistakes" note */}
                    {reply.layer === 2 && <p className="mt-4 text-xs text-gray-500">{strings.disclaimer}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AskAISection;
