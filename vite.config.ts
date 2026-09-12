import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Target modern browsers for smaller, more efficient output
    target: 'es2020',
    // Disable inlining of assets below 4kb (prevents base64 bloat in JS)
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Split large vendor libraries into separate chunks for better caching
        manualChunks: {
          // React core — stable, rarely changes, cached long-term
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Supabase — only needed for data-fetching pages
          'supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
});
