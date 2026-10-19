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
import { MessageCircle } from 'lucide-react';
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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openPanel = useCallback(() => {
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
    // Return focus to the launcher once it has re-rendered
    setTimeout(() => buttonRef.current?.focus(), 0);
  }, []);

  if (pathname?.includes('/admin')) return null;

  return (
    <>
      {consentDone && !open && (
        <button
          ref={buttonRef}
          type="button"
          onClick={openPanel}
          onPointerEnter={loadPanel}
          onFocus={loadPanel}
          aria-haspopup="dialog"
          className="fixed z-40 end-4 bottom-24 lg:bottom-6 rtl:lg:bottom-24 inline-flex items-center gap-2 rounded-full bg-brand-navy text-white ps-3.5 pe-4 py-3 text-sm font-semibold shadow-lg ring-2 ring-brand-gold/70 hover:bg-[#143a5e] motion-safe:transition-transform motion-safe:hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          <MessageCircle className="w-5 h-5 text-brand-gold" aria-hidden="true" />
          <span>{label}</span>
        </button>
      )}
      {everOpened && (
        <ChatPanel
          locale={lang}
          open={open}
          onClose={close}
          seed={seed}
          onSeedConsumed={() => setSeed(null)}
        />
      )}
    </>
  );
};

export default ChatLauncher;
