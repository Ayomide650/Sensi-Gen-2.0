import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Sensi-Gen-2.0/',  // Must match your GitHub repo name exactly
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'docs',  // GitHub Pages will serve from /docs folder
    assetsDir: 'assets',
  },
});
