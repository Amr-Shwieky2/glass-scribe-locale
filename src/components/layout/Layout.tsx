/**
 * Layout Component
 * Main layout wrapper with Header, Footer, Mobile CTA, and SEO.
 * RTL direction is handled by LanguageContext — no duplication here.
 */

import { type FC, type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileCTA from '../MobileCTA';
import SEOHead from '../SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { isRTL, currentLanguage } = useLanguage();

  // Skip to main content text in all languages
  const skipText = {
    he: 'דלג לתוכן הראשי',
    en: 'Skip to main content',
    ar: 'انتقل إلى المحتوى الرئيسي',
    ru: 'Перейти к основному содержанию',
  };

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Skip to main content - Accessibility requirement */}
      <a 
        href="#main-content" 
        className="skip-to-main"
        tabIndex={0}
      >
        {skipText[currentLanguage] || skipText.he}
      </a>
      <SEOHead />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer />
      <MobileCTA />
    </div>
  );
};

export default Layout;
