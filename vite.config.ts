import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Relative base ("./") keeps the built assets portable across
// GitHub Pages project sub-paths, Vercel and Netlify without extra config.
// Override with SITE_BASE=/my-custom-path/ when deploying to a custom domain root.
const base = process.env.SITE_BASE || './';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    cssCodeSplit: false,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
});
