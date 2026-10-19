'use client';
/**
 * The always-loaded part of the chat: the floating "Ask our AI" button
 * (desktop), a once-per-session greeting bubble, and the OPEN_CHAT_EVENT
 * listener used by the header, the mobile bottom bar, the Ask AI section and
 * the service pages. The panel (and everything it needs) is a separate chunk,
 * downloaded the first time the chat opens (or on hover/focus of a chat
 * button, as a head start), so it doesn't affect first load or LCP.
 *
 * Placement: inline-end bottom corner on desktop — above the cookie banner
 * while it is shown and, in RTL (end = left), above the accessibility button
 * (see .chat-dock in index.css). On mobile the bottom bar's "Ask AI" button
 * takes its place.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Loader2, Sparkles, X } from 'lucide-react';
import { trackEvent } from '@/lib/gtag';
import type { ChatLauncherStrings } from '@/data/chat';
import type { QuestionAnswer } from '@/data/faq';
import type { SupportedLocale } from '@/data/types';
import { CHAT_TRIGGER_ATTR, OPEN_CHAT_EVENT, hasCookieConsent, loadChatPanel, type ChatSeed } from './chat-events';

const ChatPanel = dynamic(loadChatPanel, { ssr: false });

const GREETING_KEY = 'shwaki-chat-greeting';
const GREETING_DELAY_MS = 8000;
const GREETING_VISIBLE_MS = 10000;
const NO_KEYBOARD_INPUTS = new Set(['checkbox', 'radio', 'button', 'submit', 'reset', 'range', 'color', 'file', 'image']);

const isMobile = () => window.matchMedia('(max-width: 1023px)').matches;

/** On a phone, a focused text field means the on-screen keyboard is open. */
function keyboardOpen(): boolean {
  if (!isMobile()) return false;
  const el = document.activeElement;
  if (!(el instanceof HTMLElement)) return false;
  if (el instanceof HTMLInputElement) return !NO_KEYBOARD_INPUTS.has(el.type);
  return el.isContentEditable || el instanceof HTMLTextAreaElement;
}

function greetingSeen(): boolean {
  try {
    return sessionStorage.getItem(GREETING_KEY) !== null;
  } catch {
    return true; // storage blocked: can't keep it to once per session, so don't show it
  }
}

function markGreetingSeen(): void {
  try {
    sessionStorage.setItem(GREETING_KEY, '1');
  } catch {
    /* ignore */
  }
}

const isShown = (el: HTMLElement | null | undefined): el is HTMLElement => !!el && el.isConnected && el.getClientRects().length > 0;

interface ChatLauncherProps {
  lang: SupportedLocale;
  strings: ChatLauncherStrings;
  /** Popular questions with their official answers (the chat's starter chips). */
  starters: QuestionAnswer[];
}

const ChatLauncher: React.FC<ChatLauncherProps> = ({ lang, strings, starters }) => {
  const pathname = usePathname();
  const isAdmin = !!pathname?.includes('/admin');
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [seed, setSeed] = useState<ChatSeed | null>(null);
  /** True once the lazily loaded panel has mounted (until then a loading state is shown). */
  const [panelReady, setPanelReady] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  /** The control that opened the chat, to get focus back on close. */
  const openerRef = useRef<HTMLElement | null>(null);

  const openPanel = useCallback(() => {
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    markGreetingSeen();
    setGreeting(false);
    setEverOpened(true);
    setOpen(true);
    trackEvent({ action: 'chat_open', category: 'AI Chat', label: lang });
  }, [lang]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<ChatSeed | undefined>).detail;
      if (detail) setSeed(detail);
      openPanel();
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, [openPanel]);

  // ---- greeting bubble: once per session, ~8 s after load, never over the cookie banner or the keyboard ----
  useEffect(() => {
    if (isAdmin || greetingSeen()) return;
    let timer: ReturnType<typeof setTimeout>;
    const tryShow = () => {
      if (greetingSeen()) return; // the chat was opened meanwhile
      if (!hasCookieConsent() || keyboardOpen()) {
        timer = setTimeout(tryShow, 2000); // check again once the banner is answered / the keyboard is closed
        return;
      }
      markGreetingSeen();
      setGreeting(true);
    };
    timer = setTimeout(tryShow, GREETING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [isAdmin]);

  useEffect(() => {
    if (!greeting) return;
    const hide = () => setGreeting(false);
    const timer = setTimeout(hide, GREETING_VISIBLE_MS);
    const onFocusIn = () => { if (keyboardOpen()) hide(); };
    document.addEventListener('focusin', onFocusIn);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [greeting]);

  const close = useCallback(() => {
    setOpen(false);
    // Back to whatever opened the chat; if it is gone (e.g. the mobile menu closed), to a visible chat button
    setTimeout(() => {
      const triggers = Array.from(document.querySelectorAll<HTMLElement>(`[${CHAT_TRIGGER_ATTR}]`));
      [openerRef.current, buttonRef.current, ...triggers].find(isShown)?.focus();
    }, 0);
  }, []);

  const onPanelReady = useCallback(() => setPanelReady(true), []);
  const onSeedConsumed = useCallback(() => setSeed(null), []);
  const loading = open && !panelReady;

  if (isAdmin) return null;

  return (
    <>
      {!(open && panelReady) && (
        <button
          ref={buttonRef}
          type="button"
          onClick={loading ? undefined : openPanel}
          onPointerEnter={loadChatPanel}
          onFocus={loadChatPanel}
          aria-label={strings.label}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-busy={loading || undefined}
          data-chat-trigger=""
          className="chat-dock fixed z-40 end-4 hidden lg:inline-flex items-center gap-2 rounded-full bg-brand-navy text-white ps-4 pe-5 py-3 text-[15px] font-semibold shadow-lg ring-2 ring-brand-gold/70 hover:bg-[#143a5e] motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          {loading
            ? <Loader2 className="w-5 h-5 text-brand-gold motion-safe:animate-spin" aria-hidden="true" />
            : <Sparkles className="w-5 h-5 text-brand-gold" aria-hidden="true" />}
          <span>{strings.label}</span>
        </button>
      )}

      {/* Phones: the panel is a full-screen sheet, so show its place while the chunk loads */}
      {loading && (
        <div role="status" className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-3 bg-white lg:hidden">
          <Loader2 className="h-8 w-8 text-brand-gold motion-safe:animate-spin" aria-hidden="true" />
          <span className="text-sm text-brand-navy">{strings.loading}</span>
        </div>
      )}

      {greeting && !open && (
        <div className="chat-greeting fixed z-40 chat-greeting-in">
          <div className="relative flex items-start gap-1 rounded-2xl border border-brand-gold/60 bg-white p-1 shadow-xl">
            <button
              type="button"
              onClick={openPanel}
              onPointerEnter={loadChatPanel}
              onFocus={loadChatPanel}
              aria-haspopup="dialog"
              className="min-w-0 flex-1 rounded-xl px-3 py-2 text-start text-sm font-medium leading-snug text-brand-navy hover:bg-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
            >
              {strings.greeting}
            </button>
            <button
              type="button"
              onClick={() => setGreeting(false)}
              aria-label={strings.dismiss}
              title={strings.dismiss}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            {/* Tail pointing down at the chat button */}
            <span aria-hidden="true" className="absolute -bottom-[7px] end-3 lg:end-5 h-3 w-3 rotate-45 border-b border-r border-brand-gold/60 bg-white" />
          </div>
        </div>
      )}
      <div className="sr-only" aria-live="polite">{greeting && !open ? strings.greeting : ''}</div>

      {everOpened && (
        <ChatPanel
          locale={lang}
          open={open}
          onClose={close}
          seed={seed}
          onSeedConsumed={onSeedConsumed}
          onReady={onPanelReady}
          starters={starters}
        />
      )}
    </>
  );
};

export default ChatLauncher;
