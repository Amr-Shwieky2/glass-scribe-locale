/**
 * Application Entry Point
 * Main entry point for the React application.
 */

import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import './i18n';

// =============================================================================
// APP MOUNTING
// =============================================================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
