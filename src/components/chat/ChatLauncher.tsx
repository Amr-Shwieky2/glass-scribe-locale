'use client';
/**
 * Floating "Ask us" chat button — the only chat code loaded on every page.
 * The panel (and everything it needs) is a separate chunk, downloaded the
 * first time the visitor opens the chat (or hovers/focuses the button, as a
 * head start), so it doesn't affect first load or LCP.
 *
 * Placement: inline-end corner. On mobile it sits above the MobileCTA bar; in
 * RTL (end = left) it also stays above the accessibility button, which is
 * fixed bottom-left in every language. Hidden while the cookie banner is up.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Loader2, MessageCircle } from 'lucide-react';
import { trackEvent } from '@/lib/gtag';
import type { SupportedLocale } from '@/data/types';
import { COOKIE_CONSENT_EVENT, OPEN_CHAT_EVENT, hasCookieConsent, type ChatSeed } from './chat-events';

const loadPanel = () => import('./ChatPanel');
const ChatPanel = dynamic(loadPanel, { ssr: false });

interface ChatLauncherProps {
  lang: SupportedLocale;
  label: string;
}

const ChatLauncher: React.FC<ChatLauncherProps> = ({ lang, label }) => {
  const pathname = usePathname();
  const [consentDone, setConsentDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [seed, setSeed] = useState<ChatSeed | null>(null);
  /** True once the lazily loaded panel has mounted (until then the launcher shows a spinner). */
  const [panelReady, setPanelReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  /** The control that opened the chat (launcher, or "Continue in chat"), to get focus back on close. */
  const openerRef = useRef<HTMLElement | null>(null);

  const openPanel = useCallback(() => {
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    setEverOpened(true);
    setOpen(true);
    trackEvent({ action: 'chat_open', category: 'AI Chat', label: lang });
  }, [lang]);

  useEffect(() => {
    setConsentDone(hasCookieConsent());
    const onConsent = () => setConsentDone(true);
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<ChatSeed | undefined>).detail;
      if (detail) setSeed(detail);
      openPanel();
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, onConsent);
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, onConsent);
      window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
    };
  }, [openPanel]);

  const close = useCallback(() => {
    setOpen(false);
    // Back to whatever opened the chat, or the launcher, once it has re-rendered
    setTimeout(() => {
      const opener = openerRef.current;
      if (opener && opener.isConnected && opener !== buttonRef.current && opener.offsetParent !== null) opener.focus();
      else buttonRef.current?.focus();
    }, 0);
  }, []);

  const onPanelReady = useCallback(() => setPanelReady(true), []);
  const onSeedConsumed = useCallback(() => setSeed(null), []);
  const loading = open && !panelReady;

  if (pathname?.includes('/admin')) return null;

  return (
    <>
      {(consentDone || loading) && !(open && panelReady) && (
        <button
          ref={buttonRef}
          type="button"
          onClick={loading ? undefined : openPanel}
          aria-busy={loading || undefined}
          onPointerEnter={loadPanel}
          onFocus={loadPanel}
          aria-haspopup="dialog"
          className="fixed z-40 end-4 bottom-24 lg:bottom-6 rtl:lg:bottom-24 inline-flex items-center gap-2 rounded-full bg-brand-navy text-white ps-3.5 pe-4 py-3 text-sm font-semibold shadow-lg ring-2 ring-brand-gold/70 hover:bg-[#143a5e] motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          {loading
            ? <Loader2 className="w-5 h-5 text-brand-gold motion-safe:animate-spin" aria-hidden="true" />
            : <MessageCircle className="w-5 h-5 text-brand-gold" aria-hidden="true" />}
          <span>{label}</span>
        </button>
      )}
      {everOpened && (
        <ChatPanel
          locale={lang}
          open={open}
          onClose={close}
          seed={seed}
          onSeedConsumed={onSeedConsumed}
          onReady={onPanelReady}
        />
      )}
    </>
  );
};

export default ChatLauncher;
