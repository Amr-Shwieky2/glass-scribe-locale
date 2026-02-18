import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle } from 'lucide-react';
import { UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

interface Props { navigation: { href: string; label: string }[]; isActive: (h: string) => boolean; locale: SupportedLocale; supportedLanguages: { code: string; nativeName: string }[]; currentLanguage: string; onSwitchLanguage: (c: string) => void; onWhatsApp: () => void; onCall: () => void; onClose: () => void; }

const MobileNav: React.FC<Props> = ({ navigation, isActive, locale, supportedLanguages, currentLanguage, onSwitchLanguage, onWhatsApp, onCall, onClose }) => (
  <div className="lg:hidden bg-white border-t shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <nav className="flex flex-col gap-2 sm:gap-4">
        {navigation.map((item) => (
          <Link key={item.href} to={item.href} onClick={onClose} className={`text-base sm:text-lg font-medium py-2 sm:py-3 px-2 rounded-lg transition-colors ${isActive(item.href) ? 'text-brand-gold bg-brand-gold/5' : 'text-brand-navy hover:bg-gray-50'}`}>{item.label}</Link>
        ))}
        <div className="border-t pt-4 mt-2 sm:mt-4">
          <p className="text-sm text-gray-500 mb-2 px-2">{getLocalizedText(UI_STRINGS.headerSelectLanguage, locale)}</p>
          <div className="flex flex-wrap gap-2 px-2">
            {supportedLanguages.map((lang) => (
              <Button key={lang.code} variant={currentLanguage === lang.code ? 'default' : 'outline'} size="sm" className="flex-1 min-w-[80px]" onClick={() => { onSwitchLanguage(lang.code); onClose(); }}>{lang.nativeName}</Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 px-2">
          <Button onClick={onCall} className="flex-1 h-12" variant="outline"><Phone className="w-4 h-4 mr-2" />{getLocalizedText(UI_STRINGS.headerCallShort, locale)}</Button>
          <Button onClick={onWhatsApp} className="flex-1 h-12 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy"><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</Button>
        </div>
      </nav>
    </div>
  </div>
);

export default MobileNav;
