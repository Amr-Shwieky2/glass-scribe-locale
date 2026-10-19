'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Globe, ChevronDown } from 'lucide-react';
import SimpleMenu from '@/components/ui/simple-menu';
import { NAVIGATION } from '@/data/navigation';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

interface Props { navigation: { href: string; label: string }[]; isActive: (h: string) => boolean; locale: SupportedLocale; supportedLanguages: { code: string; nativeName: string }[]; currentLanguage: string; onSwitchLanguage: (c: string) => void; onWhatsApp: () => void; onCall: () => void; }

const DesktopNav: React.FC<Props> = ({ navigation, isActive, locale, supportedLanguages, currentLanguage, onSwitchLanguage, onWhatsApp, onCall }) => (
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
