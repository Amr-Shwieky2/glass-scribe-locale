import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import devApiPlugin from "./plugins/devApi";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Security headers for development
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
  // SECURITY: Only expose VITE_ prefixed env variables to client
  // This prevents secrets like TELEGRAM_BOT_TOKEN, ADMIN_PASSWORD from leaking
  envPrefix: 'VITE_',
  plugins: [
    react(),
    // Local API routes during development (login, images, delete, tag)
    mode === 'development' && devApiPlugin(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - loaded immediately
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Router - loaded immediately
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          // Animation libraries - can be deferred
          if (id.includes('framer-motion') || id.includes('@react-spring')) {
            return 'animation';
          }
          // UI components - lazy load
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui';
          }
          // i18n - loaded on demand
          if (id.includes('i18next')) {
            return 'i18n';
          }
        },
      },
    },
    chunkSizeWarningLimit: 500,
    // Disable source maps in production for security
    sourcemap: mode === 'development',
    // Optimize CSS
    cssCodeSplit: true,
    // Use esbuild for minification (faster and built-in)
    minify: 'esbuild',
    target: 'es2020',
    // Reduce bundle size
    reportCompressedSize: false,
    // Tree shake better
    modulePreload: {
      polyfill: false,
    },
  },
  // Drop console.log and debugger in production
  esbuild: mode === 'production' ? { 
    drop: ['console', 'debugger'],
    legalComments: 'none',
    treeShaking: true,
  } : undefined,
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@react-spring/web',
      'framer-motion',
    ],
  },
}));
