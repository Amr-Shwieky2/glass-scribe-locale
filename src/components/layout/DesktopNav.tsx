'use client';
import React from 'react';
import Link from 'next/link';;
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Globe, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NAVIGATION, UI_STRINGS, getLocalizedText, type SupportedLocale } from '@/data';

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-semibold px-6 rounded-full">
            <Phone className="w-4 h-4 mr-2" /><span>{getLocalizedText(NAVIGATION.cta.label, locale)}</span><ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onCall}><Phone className="w-4 h-4 mr-2" />{getLocalizedText(UI_STRINGS.callNow, locale)}</DropdownMenuItem>
          <DropdownMenuItem onClick={onWhatsApp}><MessageCircle className="w-4 h-4 mr-2" />WhatsApp</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-brand-navy">
            <Globe className="w-4 h-4 mr-1" /><span className="text-xs font-medium">{supportedLanguages.find(l => l.code === currentLanguage)?.nativeName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          {supportedLanguages.map((lang) => (
            <DropdownMenuItem key={lang.code} onClick={() => onSwitchLanguage(lang.code)} className={currentLanguage === lang.code ? 'bg-brand-gold/10' : ''}>{lang.nativeName}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </>
);

export default DesktopNav;
