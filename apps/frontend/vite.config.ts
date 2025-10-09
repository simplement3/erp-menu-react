import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Asegura que /api se mantenga
      },
    },
  },
});