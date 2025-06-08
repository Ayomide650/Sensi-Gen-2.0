import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Sensi-Gen-2.0/',
  build: {
    outDir: 'docs',
    emptyOutDir: false  // Don't delete Jekyll files
  }
});
