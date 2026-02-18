/**
 * Layout Component
 * Main layout wrapper with Header, Footer, and Mobile CTA.
 * RTL direction is handled by LanguageContext — no duplication here.
 */

import { type FC, type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileCTA from '../MobileCTA';
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileCTA />
    </div>
  );
};

export default Layout;
