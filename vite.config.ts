import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // GitHub Pages serves the site under /<repo>/; the deploy workflow sets this.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: '127.0.0.1' },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => (id.includes('/src/data/') ? 'workbooks' : id.includes('node_modules/react') ? 'react' : undefined),
      },
    },
  },
});
