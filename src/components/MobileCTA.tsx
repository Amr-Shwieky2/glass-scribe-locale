'use client';
/**
 * MobileCTA — fixed bottom bar on phones and tablets: Call, WhatsApp and Ask AI.
 * It stays in view while scrolling, so the AI assistant is always one tap away
 * (on desktop the floating chat button does that job).
 */

import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_INFO } from '@/data/contact';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';
import { loadChatPanel, openChat } from '@/components/chat/chat-events';

// Widths follow the labels (flex-auto), so three fit on a 360px phone in every language
const BUTTON_CLASS = 'flex-auto min-w-0 px-2 font-semibold rounded-lg sm:rounded-xl py-4 sm:py-6 text-[13px] sm:text-base shadow-lg';

const MobileCTA: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  // The chat isn't available on admin pages
  const showAskAi = !usePathname()?.includes('/admin');

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phoneIntl}`;
  };

  const labels = {
    call: getLocalizedText(UI_STRINGS.mobileCTACall, locale),
    whatsapp: 'WhatsApp',
    askAi: getLocalizedText(UI_STRINGS.askAi, locale),
  };

  return (
    <>
      {/* Fixed bottom CTA bar - z-30 so language dropdown (z-[55]) renders above it */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex gap-2 sm:gap-3">
              <Button
                onClick={handlePhoneCall}
                size="lg"
                className={`${BUTTON_CLASS} bg-brand-navy hover:bg-brand-navy/90 text-white`}
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="truncate">{labels.call}</span>
              </Button>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className={`${BUTTON_CLASS} bg-brand-gold hover:bg-brand-gold/90 text-brand-navy`}
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <span className="truncate">{labels.whatsapp}</span>
              </Button>
              {showAskAi && (
                <Button
                  onClick={() => openChat()}
                  onPointerDown={loadChatPanel}
                  onFocus={loadChatPanel}
                  aria-haspopup="dialog"
                  data-chat-trigger=""
                  size="lg"
                  className={`${BUTTON_CLASS} bg-white hover:bg-brand-light text-brand-navy border-2 border-brand-navy`}
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold" aria-hidden="true" />
                  <span className="truncate">{labels.askAi}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer — pushes page content above the fixed CTA bar */}
      <div className="lg:hidden h-16 sm:h-20" aria-hidden="true" />
    </>
  );
};

export default MobileCTA;
