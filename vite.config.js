import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist', 
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  optimizeDeps: {
    include: ['fast-deep-equal', '@googlemaps/markerclusterer'],
  },
});