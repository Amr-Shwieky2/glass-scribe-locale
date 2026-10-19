'use client';
/**
 * Chat assistant panel (lazy-loaded by ChatLauncher on first open).
 *
 * - Desktop: ~380×600 panel in the inline-end corner. Mobile: full-screen sheet
 *   sized to the visual viewport, so the on-screen keyboard never hides the input.
 * - role="dialog" + aria-modal, focus trap, Esc closes, focus returns to the
 *   control that opened it; finished replies are announced through a polite live region.
 * - Starter chips are our popular FAQ questions: their official answers appear
 *   at once, without an AI call; the visitor can then continue with the AI.
 * - Each message has dir="auto", so a visitor can write Russian on the Hebrew site.
 * - The conversation is kept in sessionStorage only (see chat-session.ts).
 */
import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Send, Phone, RotateCcw, BadgeCheck } from 'lucide-react';
import ChatMarkdown from './ChatMarkdown';
import QuoteCard from './QuoteCard';
import { loadChatSession, saveChatSession, clearChatSession, type ChatSessionState, type UiMessage } from './chat-session';
import type { ChatSeed } from './chat-events';
import { trackEvent } from '@/lib/gtag';
import { isBusinessOpen } from '@/lib/business-hours';
import { CHAT_LIMITS, type ChatFallbackReason, type ChatStreamEvent, type ChatTurn, type QuoteDraft } from '@/lib/chat-protocol';
import { loadSiteSearch, searchSiteOrDefaults } from '@/lib/search/client';
import { getChatStrings } from '@/data/chat';
import { CONTACT_INFO } from '@/data/contact';
import type { QuestionAnswer } from '@/data/faq';
import type { SupportedLocale } from '@/data/types';

interface ChatPanelProps {
  locale: SupportedLocale;
  open: boolean;
  onClose: () => void;
  seed: ChatSeed | null;
  onSeedConsumed: () => void;
  /** Called once mounted, so the launcher can stop showing its loading spinner. */
  onReady?: () => void;
  /** Popular questions with their official answers, shown as starter chips (answered without an AI call). */
  starters: QuestionAnswer[];
}

const WHATSAPP_NUMBER = CONTACT_INFO.whatsapp.replace('+', '');
const CATEGORY = 'AI Chat';
/** Shown when the fallback search finds fewer than 3 pages (ids from src/lib/search/documents.ts). */
const FALLBACK_PAGE_IDS = ['contact', 'service-page:glass-shower-installation', 'about'];
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
// Tail corner on the page-direction side (rtl: variants follow the page, not the bubble's dir="auto")
const USER_BUBBLE = 'rounded-2xl rounded-br-sm rtl:rounded-br-2xl rtl:rounded-bl-sm bg-brand-navy px-3.5 py-2.5 text-white';
const ASSISTANT_BUBBLE = 'rounded-2xl rounded-bl-sm rtl:rounded-bl-2xl rtl:rounded-br-sm border border-gray-100 bg-white px-3.5 py-2.5 text-brand-navy shadow-sm';

let idCounter = 0;
const newId = () => `m${Date.now().toString(36)}${(idCounter++).toString(36)}`;

/** API history: visitor/assistant turns only, consecutive same-role turns merged, last 12, starting with the visitor. */
function toTurns(messages: UiMessage[]): ChatTurn[] {
  const turns: ChatTurn[] = [];
  for (const m of messages) {
    const content = m.content.trim();
    if (!content) continue;
    const prev = turns[turns.length - 1];
    if (prev && prev.role === m.role) prev.content = `${prev.content}\n\n${content}`;
    else turns.push({ role: m.role, content });
  }
  while (turns.length && turns[0].role === 'assistant') turns.shift();
  let kept = turns.slice(-CHAT_LIMITS.maxMessages);
  if (kept[0]?.role === 'assistant') kept = kept.slice(1);
  // Unanswered visitor messages (after a fallback) are merged with the next one; if that is
  // too long, keep the newest text — it is what the visitor just wrote.
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

/** What the visitor asked, newest kept when trimming. */
function visitorSummary(messages: UiMessage[], max: number): string {
  const text = messages.filter((m) => m.role === 'user').map((m) => m.content.replace(/\s+/g, ' ').trim()).join(' / ');
  return text.length > max ? `…${text.slice(-(max - 1))}` : text;
}

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ChatPanel: React.FC<ChatPanelProps> = ({ locale, open, onClose, seed, onSeedConsumed, onReady, starters }) => {
  const s = useMemo(() => getChatStrings(locale), [locale]);
  const titleId = useId();
  const inputId = useId();
  const counterId = useId();

  const [restored, setRestored] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [quote, setQuote] = useState<QuoteDraft | null>(null);
  const [fallback, setFallback] = useState<ChatSessionState['fallback']>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [openNow, setOpenNow] = useState(() => isBusinessOpen());
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  /** Bumped by every send and by "New conversation"; late results of older requests are ignored. */
  const requestIdRef = useRef(0);
  /** Follow new text only while the visitor is at (or near) the bottom of the list. */
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
      setFallback(saved.fallback);
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored) saveChatSession({ v: 1, messages, quote, fallback });
  }, [restored, messages, quote, fallback]);

  /**
   * Adds a question with a ready answer, without an AI call: an official FAQ answer
   * (popular questions, FAQ search results) or an Ask AI answer handed over to the chat.
   */
  const addAnswered = useCallback((question: string, answer: string, faq?: boolean) => {
    stickToBottomRef.current = true;
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: 'user', content: question.slice(0, CHAT_LIMITS.maxUserChars) },
      { id: newId(), role: 'assistant', content: answer.slice(0, CHAT_LIMITS.maxAssistantChars), ...(faq ? { faq: true } : {}) },
    ]);
    setFallback(null);
    setAnnouncement(`${s.newMessage}: ${toSpeech(answer)}`);
    if (faq) trackEvent({ action: 'chat_faq_answer_shown', category: CATEGORY, label: locale });
  }, [s, locale]);

  // ---- seeds from outside the chat: popular questions, "Continue in chat", service pages ----
  useEffect(() => {
    if (!restored || !seed) return;
    if ('draft' in seed) {
      // Keep anything the visitor already typed; otherwise start their message for them
      setInput((prev) => (prev.trim() ? prev : seed.draft.slice(0, CHAT_LIMITS.maxUserChars)));
      // After the focus-on-open effect: caret at the end of the draft (on phones too — they came here to type)
      setTimeout(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }, 50);
    } else {
      addAnswered(seed.question, seed.answer, seed.faq);
    }
    onSeedConsumed();
  }, [restored, seed, onSeedConsumed, addAnswered]);

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
  }, [messages, quote, fallback, open]);

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

  /** After the focused control disappears or gets disabled (starter chip, Send, quote card), keep focus in the chat. */
  const focusComposer = useCallback(() => {
    setTimeout(() => {
      const active = document.activeElement as HTMLElement | null;
      const dialog = dialogRef.current;
      if (active && dialog?.contains(active) && active !== dialog && !(active as HTMLButtonElement).disabled) return;
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      (desktop ? inputRef.current : dialog)?.focus();
    }, 0);
  }, []);

  const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;
  // A full-screen sheet would hide the page the visitor just navigated to
  const onInternalNavigate = () => { if (isMobile()) onClose(); };

  const whatsappHref = (() => {
    const summary = visitorSummary(messages, 300);
    return `https://wa.me/${WHATSAPP_NUMBER}${summary ? `?text=${encodeURIComponent(`${s.whatsappPrefix} ${summary}`)}` : ''}`;
  })();
  const trackWhatsApp = () => trackEvent({ action: 'chat_whatsapp_click', category: CATEGORY, label: locale });
  const trackCall = () => trackEvent({ action: 'chat_call_click', category: CATEGORY, label: locale });

  const fallbackMessage = useCallback((reason: ChatFallbackReason) =>
    reason === 'rate_limited' || reason === 'daily_limit' ? s.fallbackLimit
      : reason === 'unavailable' ? s.fallbackUnavailable : s.fallbackError, [s]);

  const showFallback = useCallback(async (reason: ChatFallbackReason, query: string, isCurrent: () => boolean) => {
    trackEvent({ action: 'chat_fallback_shown', category: CATEGORY, label: reason });
    setFallback({ reason, hits: [] });
    setAnnouncement(fallbackMessage(reason));
    const ms = await loadSiteSearch(locale);
    if (ms && isCurrent()) setFallback({ reason, hits: searchSiteOrDefaults(ms, query, 3, FALLBACK_PAGE_IDS) });
  }, [locale, fallbackMessage]);

  const send = useCallback(async (raw: string) => {
    const content = raw.trim().slice(0, CHAT_LIMITS.maxUserChars);
    if (!content || busy) return;

    trackEvent({ action: 'chat_message_sent', category: CATEGORY, label: locale });
    const requestId = ++requestIdRef.current;
    const isCurrent = () => requestIdRef.current === requestId;
    const userMsg: UiMessage = { id: newId(), role: 'user', content };
    const assistantId = newId();
    const history = [...messagesRef.current, userMsg];
    stickToBottomRef.current = true;
    setMessages([...history, { id: assistantId, role: 'assistant', content: '', streaming: true }]);
    setInput('');
    setQuote(null);
    setFallback(null);
    setBusy(true);
    if (inputRef.current) inputRef.current.style.height = '';
    focusComposer();

    // No-ops once "New conversation" (or a newer message) has replaced this request
    const updateAssistant = (patch: Partial<UiMessage>) => {
      if (isCurrent()) setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, ...patch } : m)));
    };
    const dropAssistant = () => {
      if (isCurrent()) setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    };

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: toTurns(history), lang: locale }),
        signal: controller.signal,
      });

      if (!res.ok || !(res.headers.get('content-type') ?? '').includes('ndjson') || !res.body) {
        const data = await res.json().catch(() => ({}));
        dropAssistant();
        if (isCurrent()) await showFallback((data.fallback as ChatFallbackReason) ?? 'error', content, isCurrent);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let text = '';
      let draft: QuoteDraft | null = null;
      let failedReason: ChatFallbackReason | null = null;
      let cut = false;

      const handle = (line: string) => {
        if (!line.trim()) return;
        let event: ChatStreamEvent;
        try { event = JSON.parse(line); } catch { return; }
        if (event.type === 'text') {
          text += event.text;
          updateAssistant({ content: text });
        } else if (event.type === 'quote') {
          draft = event.quote;
        } else if (event.type === 'fallback') {
          failedReason = event.reason;
        } else if (event.type === 'error') {
          cut = true;
        }
      };

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        lines.forEach(handle);
      }
      handle(buffer + decoder.decode());

      if (!text && !draft) {
        dropAssistant();
        if (isCurrent()) await showFallback(failedReason ?? 'error', content, isCurrent);
        return;
      }

      if (!isCurrent()) return;
      const finalText = text || s.quoteIntro;
      updateAssistant({ content: finalText, streaming: false, cut });
      setAnnouncement(`${s.newMessage}: ${toSpeech(finalText)}`);
      if (draft) {
        setQuote(draft);
        trackEvent({ action: 'chat_quote_card_shown', category: CATEGORY, label: locale });
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        dropAssistant();
        return;
      }
      dropAssistant();
      if (isCurrent()) await showFallback('error', content, isCurrent);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      if (isCurrent()) setBusy(false);
    }
  }, [busy, locale, s, showFallback, focusComposer]);

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
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const onStarter = ({ question, answer }: QuestionAnswer) => {
    trackEvent({ action: 'chat_starter_clicked', category: CATEGORY, label: locale });
    addAnswered(question, answer, true);
    focusComposer();
  };

  const newConversation = () => {
    requestIdRef.current++;
    abortRef.current?.abort();
    stickToBottomRef.current = true;
    setMessages([]);
    setQuote(null);
    setFallback(null);
    setInput('');
    setBusy(false);
    clearChatSession();
    focusComposer();
  };

  const onQuoteSent = () => {
    trackEvent({ action: 'chat_quote_sent', category: CATEGORY, label: locale });
    setQuote(null);
    const content = `${s.thankYou}\n\n${s.fasterWhatsapp}`;
    setMessages((prev) => [...prev, { id: newId(), role: 'assistant', content, local: true, contactActions: true }]);
    setAnnouncement(content);
    focusComposer();
  };

  const onQuoteCancel = () => {
    setQuote(null);
    setMessages((prev) => [...prev, { id: newId(), role: 'assistant', content: s.cancelled, local: true }]);
    setAnnouncement(s.cancelled);
    focusComposer();
  };

  const hasVisitorMessages = messages.some((m) => m.role === 'user');
  const fallbackText = fallback ? fallbackMessage(fallback.reason) : '';

  const contactButtons = (
    <div className="flex flex-wrap gap-2 pt-1">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackWhatsApp}
        className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-3.5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-gold/90"
      >
        <WhatsAppIcon className="w-4 h-4" />
        {s.whatsapp}
      </a>
      <a
        href={`tel:${CONTACT_INFO.phoneIntl}`}
        onClick={trackCall}
        className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand-navy/20 px-3.5 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-light"
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        {s.call}
      </a>
    </div>
  );

  const iconButton = 'inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold';

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      style={viewport ? { height: viewport.height, top: viewport.top } : undefined}
      // Mobile: full-screen sheet above everything. Desktop: below the site's own dialogs
      // (accessibility panel, lightbox, cookie banner), docked above the cookie banner /
      // accessibility button (.chat-dock, index.css) and clear of the sticky header.
      className={`${open ? 'flex' : 'hidden'} chat-dock chat-dock-panel fixed z-[60] lg:z-40 inset-x-0 top-0 h-[100dvh] flex-col bg-white shadow-2xl outline-none chat-panel-in
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
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" onClick={trackWhatsApp} className={iconButton} aria-label={s.whatsapp} title={s.whatsapp}>
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

        {!hasVisitorMessages && (
          <div role="group" aria-label={s.startersLabel} className="flex flex-wrap gap-2">
            {starters.map((qa) => (
              <button
                key={qa.question}
                type="button"
                onClick={() => onStarter(qa)}
                disabled={busy}
                className="rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-start text-sm text-brand-navy hover:border-brand-gold hover:bg-brand-gold/10 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
              >
                {qa.question}
              </button>
            ))}
          </div>
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
                {m.streaming && !m.content ? (
                  <span className="inline-flex items-center gap-1 py-1" aria-label={s.typing} role="status">
                    <span className="h-2 w-2 rounded-full bg-brand-gold/70 motion-safe:animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-brand-gold/70 motion-safe:animate-bounce [animation-delay:120ms]" />
                    <span className="h-2 w-2 rounded-full bg-brand-gold/70 motion-safe:animate-bounce [animation-delay:240ms]" />
                  </span>
                ) : (
                  <ChatMarkdown
                    text={m.content}
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
                {m.cut && <p className="mt-2 text-xs text-gray-500">{s.answerCut}</p>}
                {m.contactActions && <div className="mt-2">{contactButtons}</div>}
              </div>
            </div>
          )
        )}

        {quote && (
          <QuoteCard
            key={`${quote.name}|${quote.phone}|${quote.details}`}
            locale={locale}
            s={s}
            draft={quote}
            summary={visitorSummary(messages, CHAT_LIMITS.maxSummaryChars)}
            whatsappNumber={WHATSAPP_NUMBER}
            onSent={onQuoteSent}
            onCancel={onQuoteCancel}
            onWhatsAppClick={trackWhatsApp}
          />
        )}

        {fallback && (
          <div className={`me-auto max-w-[90%] space-y-2 ${ASSISTANT_BUBBLE}`} role="status" data-chat-role="fallback">
            <p>{fallbackText}</p>
            {fallback.hits.length > 0 && (
              <ul className="space-y-1.5">
                {fallback.hits.map((hit) => {
                  const content = (
                    <>
                      <span className="block text-sm font-semibold">{hit.title}</span>
                      <span className="block truncate text-xs text-gray-600">{hit.snippet}</span>
                    </>
                  );
                  const itemClass = 'block w-full rounded-lg border border-gray-100 px-3 py-2 text-start hover:border-brand-gold hover:bg-brand-light';
                  return (
                    <li key={hit.id}>
                      {/* An FAQ entry is answered right here with the official answer; other results are pages */}
                      {hit.answer ? (
                        <button type="button" onClick={() => { addAnswered(hit.title, hit.answer!, true); focusComposer(); }} className={itemClass}>
                          {content}
                        </button>
                      ) : (
                        <Link href={hit.url} onClick={onInternalNavigate} className={itemClass}>
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {contactButtons}
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={onSubmit} className="border-t border-gray-200 bg-white px-3 pb-2.5 pt-2">
        <div className="flex items-end gap-2">
          <label htmlFor={inputId} className="sr-only">{s.inputLabel}</label>
          <textarea
            ref={inputRef}
            id={inputId}
            dir="auto"
            rows={1}
            value={input}
            onChange={onInputChange}
            onKeyDown={onInputKeyDown}
            maxLength={CHAT_LIMITS.maxUserChars}
            placeholder={s.placeholder}
            aria-describedby={counterId}
            enterKeyHint="send"
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
