'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Globe, Check, Sparkles } from 'lucide-react';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

interface Props { 
  navigation: { href: string; label: string }[]; 
  isActive: (h: string) => boolean; 
  locale: SupportedLocale; 
  supportedLanguages: { code: string; nativeName: string }[]; 
  currentLanguage: string; 
  onSwitchLanguage: (c: string) => void; 
  onWhatsApp: () => void; 
  onCall: () => void; 
  /** Opens the AI chat (absent where the chat isn't available). */
  onAskAi?: () => void;
  onClose: () => void; 
}

const MobileNav: React.FC<Props> = ({ 
  navigation, 
  isActive, 
  locale, 
  supportedLanguages, 
  currentLanguage, 
  onSwitchLanguage, 
  onWhatsApp, 
  onCall, 
  onAskAi,
  onClose 
}) => (
  <div className="lg:hidden bg-white border-t shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <nav className="flex flex-col gap-2 sm:gap-4">
        {/* Navigation Links */}
        {navigation.map((item) => (
          <Link 
            key={item.href} 
            href={item.href} 
            onClick={onClose} 
            className={`text-base sm:text-lg font-medium py-3 px-4 rounded-xl transition-all ${isActive(item.href) ? 'text-brand-gold bg-brand-gold/10 shadow-sm' : 'text-brand-navy hover:bg-gray-50'}`}
          >
            {item.label}
          </Link>
        ))}
        
        {/* Language Selector - Big and Easy */}
        <div className="border-t border-b py-5 my-3">
          <div className="flex items-center gap-2 mb-4 px-2">
            <Globe className="w-5 h-5 text-brand-navy" />
            <p className="text-base font-medium text-brand-navy">
              {getLocalizedText(UI_STRINGS.headerSelectLanguage, locale)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 px-2">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { onSwitchLanguage(lang.code); onClose(); }}
                style={{ touchAction: 'manipulation' }}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-xl text-lg font-medium transition-all ${
                  currentLanguage === lang.code 
                    ? 'bg-brand-navy text-white shadow-lg' 
                    : 'bg-gray-100 text-brand-navy hover:bg-gray-200'
                }`}
              >
                <span>{lang.nativeName}</span>
                {currentLanguage === lang.code && <Check className="w-5 h-5" />}
              </button>
            ))}
          </div>
        </div>
        
        {/* Contact Buttons */}
        <div className="flex flex-col gap-3 mt-2 px-2">
          {onAskAi && (
            <Button
              onClick={() => { onClose(); onAskAi(); }}
              aria-haspopup="dialog"
              className="w-full h-14 text-lg bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-3 text-brand-gold" aria-hidden="true" />
              {getLocalizedText(UI_STRINGS.askAi, locale)}
            </Button>
          )}
          <Button 
            onClick={onCall} 
            className="w-full h-14 text-lg" 
            variant="outline"
          >
            <Phone className="w-5 h-5 mr-3" />
            {getLocalizedText(UI_STRINGS.headerCallShort, locale)}
          </Button>
          <Button 
            onClick={onWhatsApp} 
            className="w-full h-14 text-lg bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-semibold"
          >
            <MessageCircle className="w-5 h-5 mr-3" />
            WhatsApp
          </Button>
        </div>
      </nav>
    </div>
  </div>
);

export default MobileNav;
