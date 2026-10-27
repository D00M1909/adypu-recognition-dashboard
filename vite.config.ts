import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
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
