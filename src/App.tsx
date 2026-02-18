/**
 * @fileoverview Root Application Component
 * @description Main application entry point with routing and providers.
 * 
 * ARCHITECTURE:
 * - All content is static - no backend required
 * - Text and data in /src/data/business.ts
 * - Project images use Unsplash (replace with your own images)
 */

import { lazy, Suspense, type FC, type ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/layout/Layout';

// =============================================================================
// LAZY LOADED PAGES
// =============================================================================

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Projects = lazy(() => import('./pages/Projects'));
const Contractors = lazy(() => import('./pages/Contractors'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

// =============================================================================
// LOADING COMPONENT
// =============================================================================

const PageLoader: FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-light">
    <div className="flex flex-col items-center gap-6 px-4 text-center">
      {/* Hamster Wheel Animation */}
      <div aria-label="Loading animation" role="img" className="wheel-and-hamster">
        <div className="wheel"></div>
        <div className="hamster">
          <div className="hamster__body">
            <div className="hamster__head">
              <div className="hamster__ear"></div>
              <div className="hamster__eye"></div>
              <div className="hamster__nose"></div>
            </div>
            <div className="hamster__limb hamster__limb--fr"></div>
            <div className="hamster__limb hamster__limb--fl"></div>
            <div className="hamster__limb hamster__limb--br"></div>
            <div className="hamster__limb hamster__limb--bl"></div>
            <div className="hamster__tail"></div>
          </div>
        </div>
        <div className="spoke"></div>
      </div>

      {/* Business Info for slow connections */}
      <div className="mt-4 space-y-3">
        <img src="/logo.png" alt="Shwaki Brothers Glassworks" className="w-20 h-20 mx-auto" />
        <h2 className="text-xl font-bold text-brand-navy">Shwaki Brothers Glassworks</h2>
        <p className="text-brand-navy/70 text-sm">אחים שוואקי עבודות זכוכית</p>
        
        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <a 
            href="tel:+972585022264" 
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-navy text-white rounded-full text-sm font-medium hover:bg-brand-navy/90 transition-colors"
          >
            📞 058-502-2264
          </a>
          <a 
            href="https://wa.me/972585022264" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-gold text-brand-navy rounded-full text-sm font-medium hover:bg-brand-gold/90 transition-colors"
          >
            💬 WhatsApp
          </a>
        </div>
        
        <p className="text-xs text-brand-navy/50 mt-2">Loading page...</p>
      </div>
    </div>
  </div>
);

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

const DEFAULT_LANGUAGE = 'he';

interface RouteConfig {
  path: string;
  element: ReactNode;
}

const routes: RouteConfig[] = [
  { path: '/:lang', element: <Home /> },
  { path: '/:lang/services', element: <Services /> },
  { path: '/:lang/projects', element: <Projects /> },
  { path: '/:lang/contractors', element: <Contractors /> },
  { path: '/:lang/about', element: <About /> },
  { path: '/:lang/contact', element: <Contact /> },
];

// =============================================================================
// APP COMPONENT
// =============================================================================

const App: FC = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AdminProvider>
          <LanguageProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Redirect root to default language */}
                <Route
                  path="/"
                  element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />}
                />

                {/* Admin route (no layout, no language) */}
                <Route path="/admin" element={<Admin />} />

                {/* Language-specific routes */}
                {routes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<Layout>{element}</Layout>}
                  />
                ))}

                {/* Catch-all 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </LanguageProvider>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
