/**
 * Layout Component
 * Main layout wrapper with Header, Footer, and Mobile CTA
 */

import React, { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileCTA from '../MobileCTA';
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentLanguage } = useLanguage();
  
  // Set document direction based on language
  const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';
  
  React.useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [isRTL, currentLanguage]);

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
};

export default Layout;
