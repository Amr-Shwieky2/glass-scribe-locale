/**
 * MobileCTA Component
 * Sticky bottom CTA button for mobile devices
 */

import { Phone, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getWhatsAppLink, getPhoneLink } from '@/constants/contact';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Mobile floating CTA buttons
 */
const MobileCTA: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show on scroll up, hide on scroll down
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
    const message = `Hello, I'd like a quote for glass installation. Language: ${currentLanguage}`;
    window.open(getWhatsAppLink(message), '_blank');
  };

  const handlePhoneCall = () => {
    window.open(getPhoneLink(), '_blank');
  };

  return (
    <>
      {/* Show only on mobile/tablet */}
      <div 
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
          <div className="container mx-auto px-4 py-3">
            <div className="flex gap-3">
              <Button
                onClick={handlePhoneCall}
                size="lg"
                className="flex-1 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl py-6 text-base shadow-lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('common.call_now')}
              </Button>
              <Button
                onClick={handleWhatsApp}
                size="lg"
                variant="outline"
                className="flex-1 border-2 border-accent text-accent hover:bg-accent hover:text-white font-semibold rounded-xl py-6 text-base"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                {t('common.whatsapp')}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Add bottom padding to prevent content from hiding behind sticky CTA */}
      <div className="lg:hidden h-24" />
    </>
  );
};

export default MobileCTA;
