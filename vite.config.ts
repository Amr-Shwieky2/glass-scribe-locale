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
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['@react-spring/web', 'framer-motion'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-slot'],
          'i18n-vendor': ['i18next', 'react-i18next'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    // Disable source maps in production for security
    sourcemap: mode === 'development',
    // Optimize CSS
    cssCodeSplit: true,
    // Use esbuild for minification (faster and built-in)
    minify: 'esbuild',
    target: 'esnext',
  },
  // Drop console.log and debugger in production
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : undefined,
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
