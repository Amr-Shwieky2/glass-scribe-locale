/**
 * App Component
 * Root component with optimized code splitting and lazy loading
 */

import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/layout/Layout";

// Lazy load pages for code splitting
const HomeNew = lazy(() => import("./pages/HomeNew"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Process = lazy(() => import("./pages/Process"));
const Contractors = lazy(() => import("./pages/Contractors"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="glass-morphism p-8 rounded-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm">Loading...</p>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <LanguageProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Redirect root to default language */}
              <Route path="/" element={<Navigate to="/en" replace />} />
              
              {/* Language-specific routes with lazy loading */}
              <Route
                path="/:lang"
                element={(
                  <Layout>
                    <HomeNew />
                  </Layout>
                )}
              />
              <Route
                path="/:lang/services"
                element={(
                  <Layout>
                    <Services />
                  </Layout>
                )}
              />
              <Route
                path="/:lang/projects"
                element={(
                  <Layout>
                    <Projects />
                  </Layout>
                )}
              />
              <Route
                path="/:lang/contractors"
                element={(
                  <Layout>
                    <Contractors />
                  </Layout>
                )}
              />
              <Route
                path="/:lang/process"
                element={(
                  <Layout>
                    <Process />
                  </Layout>
                )}
              />
              <Route
                path="/:lang/about"
                element={(
                  <Layout>
                    <About />
                  </Layout>
                )}
              />
              <Route
                path="/:lang/contact"
                element={(
                  <Layout>
                    <Contact />
                  </Layout>
                )}
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
