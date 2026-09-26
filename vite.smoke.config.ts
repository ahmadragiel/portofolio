import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

/**
 * SSR config used only by `npm run test:smoke`.
 * Keeps the smoke test completely separate from the production build config.
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    ssr: 'scripts/smoke-test.tsx',
    outDir: 'node_modules/.smoke',
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
