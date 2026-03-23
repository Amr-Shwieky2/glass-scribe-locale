/**
 * @fileoverview Root Application Component
 */

import { lazy, Suspense, type FC, type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/layout/Layout';
import PageLoader from './components/PageLoader';
import AccessibilityWidget from './components/accessibility/AccessibilityWidget';
import CookieConsent from './components/CookieConsent';
import JsonLdSchema from './components/JsonLdSchema';

const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const Contractors = lazy(() => import('./pages/Contractors'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const LocationPage = lazy(() => import('./pages/LocationPage'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

const DEFAULT_LANGUAGE = 'he';

interface RouteConfig { path: string; element: ReactNode; }

const routes: RouteConfig[] = [
  { path: '/:lang', element: <Home /> },
  { path: '/:lang/services', element: <Services /> },
  { path: '/:lang/services/:serviceId', element: <ServiceDetail /> },
  { path: '/:lang/projects', element: <Projects /> },
  { path: '/:lang/contractors', element: <Contractors /> },
  { path: '/:lang/about', element: <About /> },
  { path: '/:lang/contact', element: <Contact /> },
  { path: '/:lang/privacy', element: <PrivacyPolicy /> },
  { path: '/:lang/terms', element: <TermsOfUse /> },
  // Location-specific landing pages for local SEO
  { path: '/:lang/location/:location', element: <LocationPage /> },
  { path: '/:lang/jerusalem', element: <LocationPage /> },
  { path: '/:lang/tel-aviv', element: <LocationPage /> },
  { path: '/:lang/haifa', element: <LocationPage /> },
  { path: '/:lang/beer-sheva', element: <LocationPage /> },
  { path: '/:lang/netanya', element: <LocationPage /> },
];

// Gallery redirect component
const GalleryRedirect: FC = () => {
  const lang = window.location.pathname.split('/')[1] || DEFAULT_LANGUAGE;
  return <Navigate to={`/${lang}/projects`} replace />;
};

const App: FC = () => (
  <TooltipProvider>
    <Analytics />
    <SpeedInsights />
    <Toaster />
    <BrowserRouter>
      <AdminProvider>
        <LanguageProvider>
          <AccessibilityWidget />
          <CookieConsent />
          <JsonLdSchema />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to={`/${DEFAULT_LANGUAGE}`} replace />} />
              {/* Gallery redirects to Projects */}
              <Route path="/:lang/gallery" element={<GalleryRedirect />} />
              {/* Admin routes - both with and without language prefix */}
              <Route path="/admin" element={<Navigate to={`/${DEFAULT_LANGUAGE}/admin`} replace />} />
              <Route path="/:lang/admin" element={<Admin />} />
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={<Layout>{element}</Layout>} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </LanguageProvider>
      </AdminProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
