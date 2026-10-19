'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Globe, ChevronDown, Sparkles } from 'lucide-react';
import { loadChatPanel } from '@/components/chat/chat-events';
import SimpleMenu from '@/components/ui/simple-menu';
import { NAVIGATION } from '@/data/navigation';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

interface Props { navigation: { href: string; label: string }[]; isActive: (h: string) => boolean; locale: SupportedLocale; supportedLanguages: { code: string; nativeName: string }[]; currentLanguage: string; onSwitchLanguage: (c: string) => void; onWhatsApp: () => void; onCall: () => void; /** Opens the AI chat (absent where the chat isn't available). */ onAskAi?: () => void; }

const DesktopNav: React.FC<Props> = ({ navigation, isActive, locale, supportedLanguages, currentLanguage, onSwitchLanguage, onWhatsApp, onCall, onAskAi }) => (
  <>
    <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
      {navigation.map((item) => (
        <Link key={item.href} href={item.href} className={`text-sm font-medium transition-all duration-300 relative group ${isActive(item.href) ? 'text-brand-gold font-semibold' : 'text-brand-navy hover:text-brand-gold'}`}>
          {item.label}
          <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-gold transition-all duration-300 ${isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </Link>
      ))}
    </nav>
    <div className="hidden md:flex items-center gap-2">
      {/* Icon only at 1024–1199px, where the header has no room for another label (Russian, English); text from 1200px */}
      {onAskAi && (
        <Button
          size="lg"
          variant="outline"
          onClick={onAskAi}
          onPointerEnter={loadChatPanel}
          onFocus={loadChatPanel}
          aria-label={getLocalizedText(UI_STRINGS.askAi, locale)}
          title={getLocalizedText(UI_STRINGS.askAi, locale)}
          aria-haspopup="dialog"
          data-chat-trigger=""
          className="hidden lg:inline-flex h-10 w-10 p-0 xl:h-11 xl:w-auto xl:px-5 bg-white text-brand-navy font-semibold rounded-full border-2 border-brand-navy hover:bg-brand-navy hover:text-white"
        >
          <Sparkles className="w-4 h-4 text-brand-gold" aria-hidden="true" /><span className="hidden xl:inline">{getLocalizedText(UI_STRINGS.askAi, locale)}</span>
        </Button>
      )}
      <SimpleMenu
        className="w-48"
        trigger={(props) => (
          <Button {...props} size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-semibold px-6 rounded-full">
            <Phone className="w-4 h-4 mr-2" /><span>{getLocalizedText(NAVIGATION.cta.label, locale)}</span><ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        )}
        items={[
          { key: 'call', label: <><Phone className="w-4 h-4 mr-2" />{getLocalizedText(UI_STRINGS.callNow, locale)}</>, onSelect: onCall },
          { key: 'whatsapp', label: <><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</>, onSelect: onWhatsApp },
        ]}
      />
      <SimpleMenu
        className="w-32"
        trigger={(props) => (
          <Button {...props} variant="ghost" size="sm" className="text-brand-navy" aria-label="Change language">
            <Globe className="w-4 h-4 mr-1" /><span className="text-xs font-medium">{supportedLanguages.find(l => l.code === currentLanguage)?.nativeName}</span>
          </Button>
        )}
        items={supportedLanguages.map((lang) => ({
          key: lang.code,
          label: lang.nativeName,
          onSelect: () => onSwitchLanguage(lang.code),
          className: currentLanguage === lang.code ? 'bg-brand-gold/10' : '',
        }))}
      />
    </div>
  </>
);

export default DesktopNav;
