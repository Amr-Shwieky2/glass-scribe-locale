import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BUSINESS_INFO, getWhatsAppLink } from '@/constants/contact';
import { useTranslation } from 'react-i18next';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

/**
 * Floating WhatsApp Button
 * Always visible, animated, premium design
 * Appears after scroll to avoid initial distraction
 */
export const FloatingWhatsApp: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    const message = t('whatsapp.defaultMessage', 'Hello! I would like to inquire about your glass services.');
    window.open(getWhatsAppLink(message), '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="fixed bottom-6 right-6 z-50"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <motion.button
            onClick={handleClick}
            className="group relative flex items-center gap-3 text-white rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: isExpanded ? '14px 24px 14px 14px' : '14px',
              backgroundColor: '#25D366', // Official WhatsApp green
            }}
            aria-label={t('whatsapp.buttonLabel', 'Contact us on WhatsApp')}
          >
            {/* Pulse animation */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#25D366' }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* WhatsApp Icon */}
            <WhatsAppIcon size={24} className="relative z-10" />

            {/* Expanded text */}
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative overflow-hidden whitespace-nowrap text-sm font-medium"
                >
                  {t('whatsapp.buttonText', 'Chat with us')}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Tooltip on desktop */}
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none"
            >
              <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                {t('whatsapp.tooltip', 'Need help? Chat with us!')}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingWhatsApp;
