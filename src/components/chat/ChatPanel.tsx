'use client';
/**
 * Chat assistant panel (lazy-loaded by ChatLauncher on first open).
 *
 * - Desktop: ~380×600 panel in the inline-end corner. Mobile: full-screen sheet
 *   sized to the visual viewport, so the on-screen keyboard never hides the input.
 * - role="dialog" + aria-modal, focus trap, Esc closes, focus returns to the
 *   control that opened it; new replies are announced through a polite live region.
 * - Replies come from /api/chat (our own answer engine first — see
 *   src/lib/assistant.ts): answers with links and related questions, "Did you
 *   mean…?" options, or a hand-off to our team (free quote, WhatsApp, call).
 * - Starter chips are our popular FAQ questions, answered with the official text
 *   right here, without a request.
 * - Guided quote request without any AI: product → city → size → timing →
 *   name → phone (all skippable except name and phone), then the editable
 *   confirmation card with consent; nothing is sent before the visitor presses
 *   Send. Quote answers stay in the browser — they are never sent to /api/chat.
 *   It is asked in the visitor's language (the reply's), which may differ from the page.
 * - Each message has dir="auto", so a visitor can write Russian on the Hebrew site.
 * - The conversation is kept in sessionStorage only (see chat-session.ts).
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Send, Phone, RotateCcw, BadgeCheck, FileText } from 'lucide-react';
import ChatMarkdown from './ChatMarkdown';
import QuoteCard from './QuoteCard';
import {
  loadChatSession, saveChatSession, clearChatSession,
  type QuoteFlow, type QuoteStep, type UiMessage,
} from './chat-session';
import type { ChatSeed } from './chat-events';
import { trackEvent } from '@/lib/gtag';
import { isBusinessOpen } from '@/lib/business-hours';
import {
  CHAT_LIMITS, QUOTE_FIELD_LIMITS, QUOTE_PRODUCTS,
  type AssistantReply, type ChatTurn, type QuoteDraft, type QuoteProduct, type ReplySuggestion,
} from '@/lib/chat-protocol';
import { isValidPhone } from '@/lib/validation';
import { ASSISTANT_REPLIES } from '@/data/assistant-replies';
import { getChatStrings, type ChatStrings } from '@/data/chat';
import { CONTACT_INFO } from '@/data/contact';
import { getPopularQuestions, type QuestionAnswer } from '@/data/faq';
import type { SupportedLocale } from '@/data/types';

interface ChatPanelProps {
  locale: SupportedLocale;
  open: boolean;
  onClose: () => void;
  seed: ChatSeed | null;
  onSeedConsumed: () => void;
  /** Called once mounted, so the launcher can stop showing its loading spinner. */
  onReady?: () => void;
}

const WHATSAPP_NUMBER = CONTACT_INFO.whatsapp.replace('+', '');
const CATEGORY = 'AI Chat';
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
// Tail corner on the page-direction side (rtl: variants follow the page, not the bubble's dir="auto")
const USER_BUBBLE = 'rounded-2xl rounded-br-sm rtl:rounded-br-2xl rtl:rounded-bl-sm bg-brand-navy px-3.5 py-2.5 text-white';
const ASSISTANT_BUBBLE = 'rounded-2xl rounded-bl-sm rtl:rounded-bl-2xl rtl:rounded-br-sm border border-gray-100 bg-white px-3.5 py-2.5 text-brand-navy shadow-sm';
const CHIP = 'rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-start text-sm text-brand-navy hover:border-brand-gold hover:bg-brand-gold/10 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-navy';

const QUOTE_STEPS: QuoteStep[] = ['product', 'city', 'size', 'timing', 'name', 'phone'];
const TIMINGS = ['timingAsap', 'timingMonth', 'timingLater', 'timingBrowsing'] as const;
const PRODUCT_LABEL: Record<QuoteProduct, keyof ChatStrings> = {
  shower: 'productShower', railing: 'productRailing', mirror: 'productMirror', storefront: 'productStorefront',
  partition: 'productPartition', door: 'productDoor', backsplash: 'productBacksplash', shelf: 'productShelf', other: 'productOther',
};
const STEP_PROMPT: Record<QuoteStep, keyof ChatStrings> = {
  product: 'quoteProduct', city: 'quoteCity', size: 'quoteSize', timing: 'quoteTiming', name: 'quoteName', phone: 'quotePhone',
};
const STEP_PLACEHOLDER: Record<QuoteStep, keyof ChatStrings> = {
  product: 'quoteProductPlaceholder', city: 'quoteCityPlaceholder', size: 'quoteSizePlaceholder',
  timing: 'quoteTimingPlaceholder', name: 'quoteNamePlaceholder', phone: 'quotePhonePlaceholder',
};

type QuotePrefill = NonNullable<AssistantReply['quotePrefill']>;

/** UI strings per language: the page's, or the visitor's for the quote request (built once per language). */
const STRINGS: Partial<Record<SupportedLocale, ChatStrings>> = {};
const stringsFor = (lang: SupportedLocale): ChatStrings => (STRINGS[lang] ??= getChatStrings(lang));

let idCounter = 0;
const newId = () => `m${Date.now().toString(36)}${(idCounter++).toString(36)}`;

/**
 * API history: the conversation only (no quote steps or our own hand-offs), last 12, starting with the visitor.
 * Of visitor messages in a row only the newest is kept: the older ones got no answer from the server (hand-off,
 * quote start, failed request), and the server answers the last turn — merged, it would answer them again.
 * Consecutive assistant messages are merged.
 */
function toTurns(messages: UiMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const m of messages) {
    const content = m.content.trim();
    if (!content || m.local || m.pending) continue;
    const prev = turns[turns.length - 1];
    if (prev?.role !== m.role) turns.push({ role: m.role, content });
    else if (m.role === 'user') prev.content = content;
    else prev.content = `${prev.content}\n\n${content}`;
  }
  while (turns.length && turns[0].role === 'assistant') turns.shift();
  let kept = turns.slice(-CHAT_LIMITS.maxMessages);
  if (kept[0]?.role === 'assistant') kept = kept.slice(1);
  // Merged assistant messages may be too long; keep the newest text
  return kept.map((t) => {
    const max = t.role === 'user' ? CHAT_LIMITS.maxUserChars : CHAT_LIMITS.maxAssistantChars;
    return { role: t.role, content: t.content.length > max ? `…${t.content.slice(-(max - 1))}` : t.content };
  });
}

/** Plain text for the screen-reader announcement: link labels instead of URLs, no Markdown markers. */
function toSpeech(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/^\s*(?:[-*•]|\d{1,2}[.)])\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** What the visitor asked in the conversation (not the quote answers), newest kept when trimming. */
function visitorSummary(messages: UiMessage[], max: number): string {
  const text = messages
    .filter((m) => m.role === 'user' && !m.local)
    .map((m) => m.content.replace(/\s+/g, ' ').trim())
    .join(' / ');
  return text.length > max ? `…${text.slice(-(max - 1))}` : text;
}

/** The first step after `from` that still has no answer (prefilled ones are skipped). */
function nextStep(data: QuoteFlow['data'], from?: QuoteStep): QuoteStep | null {
  const start = from ? QUOTE_STEPS.indexOf(from) + 1 : 0;
  for (const step of QUOTE_STEPS.slice(start)) if (!data[step]) return step;
  return null;
}

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/** Grows the composer with its text, up to 128px. */
function autosize(el: HTMLTextAreaElement): void {
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ locale, open, onClose, seed, onSeedConsumed, onReady }) => {
  const s = stringsFor(locale);
  // Starter chips: our popular FAQ questions, answered with the official text (bundled with this lazy chunk)
  const starters = useMemo(() => getPopularQuestions(locale), [locale]);
  const titleId = useId();
  const inputId = useId();
  const counterId = useId();
  const errorId = useId();

  const [restored, setRestored] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [quote, setQuote] = useState<QuoteDraft | null>(null);
  const [flow, setFlow] = useState<QuoteFlow | null>(null);
  const [stepError, setStepError] = useState('');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [openNow, setOpenNow] = useState(() => isBusinessOpen());
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  /** Bumped by every request and by "New conversation"; late results of older requests are ignored. */
  const requestIdRef = useRef(0);
  /** Follow new messages only while the visitor is at (or near) the bottom of the list. */
  const stickToBottomRef = useRef(true);
  const messagesRef = useRef<UiMessage[]>([]);
  messagesRef.current = messages;

  useEffect(() => { onReady?.(); }, [onReady]);

  // ---- session persistence ---------------------------------------------------
  useEffect(() => {
    const saved = loadChatSession();
    if (saved) {
      setMessages(saved.messages);
      setQuote(saved.quote);
      setFlow(saved.flow);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored) saveChatSession({ v: 2, messages, quote, flow });
  }, [restored, messages, quote, flow]);

  const push = useCallback((...added: UiMessage[]) => {
    stickToBottomRef.current = true;
    setMessages((prev) => [...prev, ...added]);
  }, []);

  /** After the focused control disappears or gets disabled (chip, Send, quote card), keep focus in the chat. */
  const focusComposer = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement as HTMLElement | null;
      const dialog = dialogRef.current;
      if (active && dialog?.contains(active) && active !== dialog && !(active as HTMLButtonElement).disabled) return;
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      (desktop ? inputRef.current : dialog)?.focus();
    }, 0);
  }, []);

  // ---- guided quote request ------------------------------------------------------
  /** Asks `step` in the request's language; `lead` (what was just said before it) is read out with it in one announcement. */
  const askStep = useCallback((step: QuoteStep, lang: SupportedLocale, lead?: string) => {
    const prompt = stringsFor(lang)[STEP_PROMPT[step]];
    push({ id: newId(), role: 'assistant', content: prompt, local: true, step });
    setAnnouncement(lead ? `${lead} ${prompt}` : prompt);
  }, [push]);

  const finishQuote = useCallback((data: QuoteFlow['data'], lang: SupportedLocale, lead?: string) => {
    const fs = stringsFor(lang);
    const details = [
      data.size ? `${fs.detailsSize}: ${data.size}` : '',
      data.timing ? `${fs.detailsTiming}: ${data.timing}` : '',
    ].filter(Boolean).join(' · ');
    setFlow(null);
    setQuote({
      name: data.name ?? '',
      phone: data.phone ?? '',
      city: (data.city ?? '').slice(0, QUOTE_FIELD_LIMITS.city),
      service: (data.product ?? '').slice(0, QUOTE_FIELD_LIMITS.service),
      details: details.slice(0, QUOTE_FIELD_LIMITS.details),
      language: lang,
    });
    push({ id: newId(), role: 'assistant', content: fs.quoteIntro, local: true });
    setAnnouncement(lead ? `${lead} ${fs.quoteIntro}` : fs.quoteIntro);
    trackEvent({ action: 'chat_quote_card_shown', category: CATEGORY, label: locale });
  }, [push, locale]);

  /**
   * Starts the guided quote request in `lang` (with what we already know), optionally after an intro message.
   * `lead` (by default the intro) is read out together with the first question.
   */
  const startQuote = useCallback((lang: SupportedLocale, prefill: QuotePrefill = {}, intro?: string, lead: string | undefined = intro) => {
    if (intro) push({ id: newId(), role: 'assistant', content: intro, local: true });
    const data: QuoteFlow['data'] = {
      ...(prefill.product ? { product: stringsFor(lang)[PRODUCT_LABEL[prefill.product]] } : {}),
      ...(prefill.city ? { city: prefill.city } : {}),
    };
    const first = nextStep(data);
    setQuote(null);
    setStepError('');
    trackEvent({ action: 'chat_quote_started', category: CATEGORY, label: locale });
    if (!first) return finishQuote(data, lang, lead);
    setFlow({ step: first, lang, data });
    askStep(first, lang, lead);
  }, [push, askStep, finishQuote, locale]);

  /** The visitor's answer to the current quote step (null = Skip). */
  const answerStep = useCallback((value: string | null) => {
    if (!flow) return;
    const { step, lang } = flow;
    const fs = stringsFor(lang);
    const text = value?.trim() ?? '';
    if (step === 'name' && (text.length < 2 || text.length > QUOTE_FIELD_LIMITS.name)) {
      setStepError(fs.nameInvalid);
      return;
    }
    if (step === 'phone' && (!text || text.length > QUOTE_FIELD_LIMITS.phone || !isValidPhone(text))) {
      setStepError(fs.phoneInvalid);
      return;
    }
    setStepError('');
    setInput('');
    if (inputRef.current) inputRef.current.style.height = '';
    push({ id: newId(), role: 'user', content: text || fs.skip, local: true });
    const data = { ...flow.data, ...(text ? { [step]: text.slice(0, 200) } : {}) };
    const next = nextStep(data, step);
    if (next) {
      setFlow({ step: next, lang, data });
      askStep(next, lang);
    } else {
      finishQuote(data, lang);
    }
    focusComposer();
  }, [flow, push, askStep, finishQuote, focusComposer]);

  const cancelFlow = useCallback(() => {
    const { cancelled } = flow ? stringsFor(flow.lang) : s;
    setFlow(null);
    setStepError('');
    push({ id: newId(), role: 'assistant', content: cancelled, local: true });
    setAnnouncement(cancelled);
    focusComposer();
  }, [flow, push, s, focusComposer]);

  /** The visitor moved on to a question: leave the quote request silently, so what they type next isn't taken as an answer. */
  const dropFlow = useCallback(() => {
    setFlow(null);
    setStepError('');
  }, []);

  // ---- replies ---------------------------------------------------------------------
  /** Adds the reply to the pending message `pendingId` (or a local hand-off when the request failed). */
  const showReply = useCallback((pendingId: string, reply: AssistantReply | null, question: string) => {
    const message: UiMessage = reply
      ? {
          id: pendingId, role: 'assistant', content: reply.text, lang: reply.lang,
          links: reply.links, suggestions: reply.suggestions, didYouMean: reply.kind === 'suggest',
          actions: reply.actions, ...(reply.kind === 'none' || reply.kind === 'quote' ? { question } : {}),
          ...(reply.quotePrefill ? { quotePrefill: reply.quotePrefill } : {}),
          // Our own fixed replies (hand-off, quote start) are not conversation for the server
          ...(reply.kind === 'quote' || reply.kind === 'none' ? { local: true } : {}),
        }
      : { id: pendingId, role: 'assistant', content: s.notSure, local: true, actions: ['quote', 'whatsapp', 'call'], question };
    setMessages((prev) => prev.map((m) => (m.id === pendingId ? message : m)));
    const announcement = `${s.newMessage}: ${toSpeech(message.content)}`;
    trackEvent({ action: 'chat_reply', category: CATEGORY, label: reply ? `${reply.kind}-L${reply.layer}` : 'network-error' });
    // The quote request's first question is announced together with this reply, not instead of it
    if (reply?.startQuote) startQuote(reply.lang, reply.quotePrefill, undefined, announcement);
    else setAnnouncement(announcement);
  }, [s, startQuote]);

  /** POSTs to /api/chat; resolves to the reply, or null on any failure. */
  const request = useCallback(async (body: object, isCurrent: () => boolean): Promise<AssistantReply | null> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const data = (await res.json().catch(() => null)) as { reply?: AssistantReply } | null;
      return isCurrent() && res.ok && data?.reply?.text ? data.reply : null;
    } catch {
      return null;
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  }, []);

  const send = useCallback(async (raw: string) => {
    const content = raw.trim().slice(0, CHAT_LIMITS.maxUserChars);
    if (!content || busy) return;
    if (flow) return answerStep(content);

    trackEvent({ action: 'chat_message_sent', category: CATEGORY, label: locale });
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestIdRef.current === requestId;
    const userMsg: UiMessage = { id: newId(), role: 'user', content };
    const pendingId = newId();
    const history = toTurns([...messagesRef.current, userMsg]);
    push(userMsg, { id: pendingId, role: 'assistant', content: '', pending: true });
    setInput('');
    setQuote(null);
    setBusy(true);
    if (inputRef.current) inputRef.current.style.height = '';
    focusComposer();

    const reply = await request({ messages: history, lang: locale }, isCurrent);
    if (!isCurrent()) return;
    showReply(pendingId, reply, content);
    setBusy(false);
  }, [busy, flow, answerStep, locale, push, focusComposer, request, showReply]);

  /** "Did you mean" option or related question: its answer, as if the visitor had asked it. */
  const onSuggestion = useCallback(async (suggestion: ReplySuggestion, lang: SupportedLocale) => {
    if (busy) return;
    trackEvent({ action: 'chat_suggestion_clicked', category: CATEGORY, label: locale });
    dropFlow();
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestIdRef.current === requestId;
    const pendingId = newId();
    push({ id: newId(), role: 'user', content: suggestion.question }, { id: pendingId, role: 'assistant', content: '', pending: true });
    setBusy(true);
    focusComposer();
    const reply = await request({ entryId: suggestion.id, lang }, isCurrent);
    if (!isCurrent()) return;
    showReply(pendingId, reply, suggestion.question);
    setBusy(false);
  }, [busy, locale, dropFlow, push, focusComposer, request, showReply]);

  /** A question with a ready answer (official FAQ answer, or an Ask AI answer handed over) — no request. */
  const addAnswered = useCallback((question: string, answer: string, faq?: boolean) => {
    dropFlow();
    push(
      { id: newId(), role: 'user', content: question.slice(0, CHAT_LIMITS.maxUserChars) },
      { id: newId(), role: 'assistant', content: answer.slice(0, CHAT_LIMITS.maxAssistantChars), ...(faq ? { faq: true } : {}) },
    );
    setAnnouncement(`${s.newMessage}: ${toSpeech(answer)}`);
    if (faq) trackEvent({ action: 'chat_faq_answer_shown', category: CATEGORY, label: locale });
  }, [dropFlow, push, s, locale]);

  // ---- seeds from outside the chat: popular questions, "Continue in chat", service pages, quote buttons ----
  useEffect(() => {
    if (!restored || !seed) return;
    if ('draft' in seed) {
      // Keep anything the visitor already typed (unless it was meant for the quote request); otherwise start their message for them
      const keepTyped = !flow;
      dropFlow();
      setInput((prev) => (keepTyped && prev.trim() ? prev : seed.draft.slice(0, CHAT_LIMITS.maxUserChars)));
      // After the focus-on-open effect: caret at the end of the draft (on phones too — they came here to type)
      setTimeout(() => {
        const el = inputRef.current;
        if (!el) return;
        autosize(el);
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }, 50);
    } else {
      // Wait until a reply in progress has finished, so the two don't interleave
      if (busy) return;
      if ('quote' in seed) startQuote(locale, { product: seed.product, city: seed.city }, ASSISTANT_REPLIES.quoteStart[locale]);
      else addAnswered(seed.question, seed.answer, seed.faq);
    }
    onSeedConsumed();
  }, [restored, seed, busy, flow, onSeedConsumed, dropFlow, addAnswered, startQuote, locale]);

  // ---- open/closed indicator (re-checked every minute while open) --------------
  useEffect(() => {
    if (!open) return;
    setOpenNow(isBusinessOpen());
    const t = setInterval(() => setOpenNow(isBusinessOpen()), 60_000);
    return () => clearInterval(t);
  }, [open]);

  // ---- mobile: full-screen sheet that follows the visual viewport (keyboard) ---
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(max-width: 1023px)');
    const vv = window.visualViewport;
    const prevOverflow = document.documentElement.style.overflow;
    const update = () => {
      setViewport(mq.matches && vv ? { height: vv.height, top: vv.offsetTop } : null);
      // Lock page scroll only behind the full-screen (mobile) sheet
      document.documentElement.style.overflow = mq.matches ? 'hidden' : prevOverflow;
    };
    update();
    vv?.addEventListener('resize', update);
    vv?.addEventListener('scroll', update);
    mq.addEventListener('change', update);
    return () => {
      vv?.removeEventListener('resize', update);
      vv?.removeEventListener('scroll', update);
      mq.removeEventListener('change', update);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  // ---- focus on open ------------------------------------------------------------
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia('(min-width: 1024px)').matches;
    // On phones, focusing the textarea would pop the keyboard over the welcome text.
    // setTimeout (not requestAnimationFrame): rAF is paused while the tab is hidden.
    const t = setTimeout(() => (desktop ? inputRef.current : dialogRef.current)?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  // ---- keep the newest message in view (unless the visitor scrolled up to read) ---
  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottomRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, quote, open]);

  const onListScroll = () => {
    const el = listRef.current;
    if (el) stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  useEffect(() => () => abortRef.current?.abort(), []);

  // ---- Esc + focus trap, on the document so they work even if focus slipped to <body> ----
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (e.key === 'Escape' && !e.isComposing) {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!active || !dialog.contains(active)) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && (active === first || active === dialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;
  // A full-screen sheet would hide the page the visitor just navigated to
  const onInternalNavigate = () => { if (isMobile()) onClose(); };

  /** WhatsApp link pre-filled with the visitor's question (hand-off) or what they asked so far. */
  const whatsappHref = (question?: string) => {
    const text = question?.trim() || visitorSummary(messages, 300);
    return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(`${s.whatsappPrefix} ${text}`)}` : ''}`;
  };
  const trackWhatsApp = () => trackEvent({ action: 'chat_whatsapp_click', category: CATEGORY, label: locale });
  const trackCall = () => trackEvent({ action: 'chat_call_click', category: CATEGORY, label: locale });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value.slice(0, CHAT_LIMITS.maxUserChars));
    if (stepError) setStepError('');
    autosize(e.target);
  };

  const onStarter = ({ question, answer }: QuestionAnswer) => {
    trackEvent({ action: 'chat_starter_clicked', category: CATEGORY, label: locale });
    addAnswered(question, answer, true);
    focusComposer();
  };

  /** "Get a free quote": under a reply, in that reply's language and with what it already knew; otherwise in the page's. */
  const onGetQuote = (m?: UiMessage) => {
    const lang = m?.lang ?? locale;
    startQuote(lang, m?.quotePrefill, ASSISTANT_REPLIES.quoteStart[lang]);
    focusComposer();
  };

  const newConversation = () => {
    requestIdRef.current++;
    abortRef.current?.abort();
    stickToBottomRef.current = true;
    setMessages([]);
    setQuote(null);
    setFlow(null);
    setStepError('');
    setInput('');
    setBusy(false);
    clearChatSession();
    focusComposer();
  };

  // The quote card and its notes are in the language the request was asked in
  const qs = quote ? stringsFor(quote.language) : s;

  const onQuoteSent = () => {
    trackEvent({ action: 'chat_quote_sent', category: CATEGORY, label: locale });
    setQuote(null);
    const content = `${qs.thankYou}\n\n${qs.fasterWhatsapp}`;
    push({ id: newId(), role: 'assistant', content, local: true, actions: ['whatsapp', 'call'] });
    setAnnouncement(content);
    focusComposer();
  };

  const onQuoteCancel = () => {
    setQuote(null);
    push({ id: newId(), role: 'assistant', content: qs.cancelled, local: true });
    setAnnouncement(qs.cancelled);
    focusComposer();
  };

  const hasVisitorMessages = messages.some((m) => m.role === 'user');
  // The current quote question: the newest step message (it gets the step's buttons even if something came below it)
  const promptId = flow ? messages.filter((m) => m.step).pop()?.id : undefined;
  // Quote-request strings: the visitor's language while the request is being asked
  const fs = flow ? stringsFor(flow.lang) : s;
  const iconButton = 'inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold';

  const actionButtons = (m: UiMessage) => (
    <div className="mt-2 flex flex-wrap gap-2">
      {m.actions?.includes('quote') && !flow && !quote && (
        <button
          type="button"
          onClick={() => onGetQuote(m)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#143a5e] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          <FileText className="h-4 w-4 text-brand-gold" aria-hidden="true" />
          {s.getQuote}
        </button>
      )}
      {m.actions?.includes('whatsapp') && (
        <a
          href={whatsappHref(m.question)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackWhatsApp}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3.5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
        >
          <WhatsAppIcon className="w-4 h-4" />
          {s.whatsapp}
        </a>
      )}
      {m.actions?.includes('call') && (
        <a
          href={`tel:${CONTACT_INFO.phoneIntl}`}
          onClick={trackCall}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-navy/20 px-3.5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          {s.call}
        </a>
      )}
    </div>
  );

  const stepButtons = (step: QuoteStep) => (
    <div className="mt-2 flex flex-wrap gap-2">
      {step === 'product' && QUOTE_PRODUCTS.map((p) => (
        <button key={p} type="button" className={CHIP} onClick={() => answerStep(fs[PRODUCT_LABEL[p]])}>
          {fs[PRODUCT_LABEL[p]]}
        </button>
      ))}
      {step === 'timing' && TIMINGS.map((t) => (
        <button key={t} type="button" className={CHIP} onClick={() => answerStep(fs[t])}>{fs[t]}</button>
      ))}
      {step !== 'name' && step !== 'phone' && (
        <button type="button" className={CHIP} onClick={() => answerStep(null)}>{fs.skip}</button>
      )}
      <button type="button" onClick={cancelFlow} className="px-2 py-1.5 text-sm text-gray-600 underline underline-offset-2 hover:text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-navy">
        {fs.cancelQuote}
      </button>
    </div>
  );

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      style={viewport ? { height: viewport.height, top: viewport.top } : undefined}
      // Mobile: full-screen sheet above everything. Desktop: below the site's own dialogs (z-50),
      // above the cookie banner (lg:z-[45]) in case it must overlap it on a short screen; docked
      // clear of the accessibility button and the sticky header (.chat-dock-panel, index.css).
      className={`${open ? 'flex' : 'hidden'} chat-dock-panel fixed z-[60] lg:z-[46] inset-x-0 top-0 h-[100dvh] flex-col bg-white shadow-2xl outline-none chat-panel-in
        lg:inset-x-auto lg:top-auto lg:end-4 lg:h-[600px] lg:w-[380px] lg:rounded-2xl lg:border lg:border-gray-200 lg:overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-brand-navy px-3 py-2.5 text-white">
        <Image src="/logo-64.png" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full bg-white p-0.5" />
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="truncate text-sm font-bold leading-tight">{s.title}</h2>
          <p className="flex items-center gap-1.5 text-xs text-white/80">
            <span className={`h-2 w-2 shrink-0 rounded-full ${openNow ? 'bg-emerald-400' : 'bg-gray-400'}`} aria-hidden="true" />
            <span className="truncate" title={openNow ? s.online : s.offline}>{openNow ? s.online : s.offline}</span>
          </p>
        </div>
        <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" onClick={trackWhatsApp} className={iconButton} aria-label={s.whatsapp} title={s.whatsapp}>
          <WhatsAppIcon className="h-5 w-5 text-brand-gold" />
        </a>
        <a href={`tel:${CONTACT_INFO.phoneIntl}`} onClick={trackCall} className={iconButton} aria-label={`${s.call} ${CONTACT_INFO.phone}`} title={s.call}>
          <Phone className="h-5 w-5 text-brand-gold" aria-hidden="true" />
        </a>
        <button type="button" onClick={newConversation} className={iconButton} aria-label={s.newConversation} title={s.newConversation}>
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={onClose} className={iconButton} aria-label={s.close} title={s.close}>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div ref={listRef} onScroll={onListScroll} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-brand-light/60 px-3 py-4 text-[15px]">
        <div className="flex justify-start">
          <div dir="auto" className={`max-w-[90%] ${ASSISTANT_BUBBLE}`}>{s.welcome}</div>
        </div>

        {!hasVisitorMessages && !flow && (
          <div role="group" aria-label={s.startersLabel} className="flex flex-wrap gap-2">
            {starters.map((qa) => (
              <button key={qa.question} type="button" onClick={() => onStarter(qa)} disabled={busy} className={CHIP}>
                {qa.question}
              </button>
            ))}
          </div>
        )}
        {!hasVisitorMessages && !flow && !quote && (
          <button
            type="button"
            onClick={() => onGetQuote()}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-navy px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#143a5e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            <FileText className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            {s.getQuote}
          </button>
        )}

        {messages.map((m) =>
          m.role === 'user' ? (
            // Side follows the page direction; the text's own direction follows the visitor's language
            <div key={m.id} className="flex justify-end" data-chat-role="user">
              <span className="sr-only">{s.you}: </span>
              <div dir="auto" className={`max-w-[85%] whitespace-pre-wrap break-words ${USER_BUBBLE}`}>{m.content}</div>
            </div>
          ) : (
            <div key={m.id} className="flex justify-start" data-chat-role="assistant">
              <span className="sr-only">{s.assistant}: </span>
              <div dir="auto" className={`max-w-[90%] ${ASSISTANT_BUBBLE}`}>
                {m.pending ? (
                  <span className="inline-flex items-center gap-1 py-1" aria-label={s.typing} role="status">
                    <span className="h-2 w-2 rounded-full bg-brand-gold/70 motion-safe:animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-brand-gold/70 motion-safe:animate-bounce [animation-delay:120ms]" />
                    <span className="h-2 w-2 rounded-full bg-brand-gold/70 motion-safe:animate-bounce [animation-delay:240ms]" />
                  </span>
                ) : (
                  <ChatMarkdown
                    text={m.handoff ? s.notSure : m.content}
                    onLinkClick={(kind) => {
                      if (kind === 'whatsapp') trackWhatsApp();
                      else if (kind === 'tel') trackCall();
                      else onInternalNavigate();
                    }}
                  />
                )}
                {m.faq && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                    <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden="true" />
                    {s.officialAnswer}
                  </p>
                )}
                {!!m.links?.length && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-gray-600">{s.usefulPages}</p>
                    <ul className="mt-1 space-y-1">
                      {m.links.map((l) => (
                        <li key={l.url}>
                          <Link href={l.url} onClick={onInternalNavigate} className="text-sm font-semibold underline decoration-brand-gold decoration-2 underline-offset-2 hover:text-brand-gold focus-visible:outline-2">
                            {l.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!!m.suggestions?.length && (
                  <div className="mt-2" role="group" aria-label={m.didYouMean ? m.content : s.relatedQuestions}>
                    {!m.didYouMean && <p className="text-xs font-semibold text-gray-600">{s.relatedQuestions}</p>}
                    <div className="mt-1 flex flex-wrap gap-2">
                      {m.suggestions.map((sug) => (
                        <button key={sug.id} type="button" disabled={busy} onClick={() => onSuggestion(sug, m.lang ?? locale)} className={CHIP}>
                          {sug.question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!!m.actions?.length && actionButtons(m)}
                {m.step && m.id === promptId && m.step === flow?.step && stepButtons(m.step)}
              </div>
            </div>
          )
        )}

        {quote && (
          <QuoteCard
            key={`${quote.name}|${quote.phone}|${quote.details}`}
            locale={quote.language}
            s={qs}
            draft={quote}
            summary={visitorSummary(messages, CHAT_LIMITS.maxSummaryChars)}
            whatsappNumber={WHATSAPP_NUMBER}
            onSent={onQuoteSent}
            onCancel={onQuoteCancel}
            onWhatsAppClick={trackWhatsApp}
          />
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-gray-200 bg-white px-3 pb-2.5 pt-2">
        {stepError && <p id={errorId} role="alert" className="mb-1.5 text-sm text-red-700">{stepError}</p>}
        <div className="flex items-end gap-2">
          <label htmlFor={inputId} className="sr-only">{flow ? fs[STEP_PROMPT[flow.step]] : s.inputLabel}</label>
          <textarea
            ref={inputRef}
            id={inputId}
            dir="auto"
            rows={1}
            value={input}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            maxLength={CHAT_LIMITS.maxUserChars}
            placeholder={flow ? fs[STEP_PLACEHOLDER[flow.step]] : s.placeholder}
            aria-describedby={stepError ? `${errorId} ${counterId}` : counterId}
            aria-invalid={stepError ? true : undefined}
            enterKeyHint="send"
            inputMode={flow?.step === 'phone' ? 'tel' : undefined}
            autoComplete={flow?.step === 'phone' ? 'tel' : flow?.step === 'name' ? 'name' : 'off'}
            className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base text-brand-navy placeholder:text-gray-400 focus:border-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label={s.send}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gold text-brand-navy hover:bg-brand-gold/90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
          >
            <Send className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-gray-500">
          <span>{s.footerNote}</span>
          <span id={counterId} className="shrink-0 tabular-nums">{input.length}/{CHAT_LIMITS.maxUserChars}</span>
        </div>
      </form>

      <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>
    </div>
  );
};

export default ChatPanel;
