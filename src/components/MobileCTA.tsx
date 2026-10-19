'use client';
/**
 * MobileCTA Component - Static Version
 * Sticky bottom CTA button for mobile devices
 */

import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { CONTACT_INFO } from '@/data/contact';
import { UI_STRINGS } from '@/data/ui-strings';
import { getLocalizedText } from '@/data/helpers';
import type { SupportedLocale } from '@/data/types';

const MobileCTA: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage as SupportedLocale;
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${CONTACT_INFO.whatsapp}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${CONTACT_INFO.phoneIntl}`;
  };

  const labels = {
    call: getLocalizedText(UI_STRINGS.mobileCTACall, locale),
    whatsapp: 'WhatsApp',
  };

  return (
    <>
      {/* Fixed bottom CTA bar - z-30 so language dropdown (z-[55]) renders above it */}
      <div 
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex gap-2 sm:gap-3">
              <Button
                onClick={handlePhoneCall}
                size="lg"
                className="flex-1 bg-brand-navy hover:bg-brand-navy/90 text-white font-semibold rounded-lg sm:rounded-xl py-4 sm:py-6 text-sm sm:text-base shadow-lg"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                {labels.call}
              </Button>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                className="flex-1 bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-semibold rounded-lg sm:rounded-xl py-4 sm:py-6 text-sm sm:text-base shadow-lg"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                {labels.whatsapp}
              </Button>
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
