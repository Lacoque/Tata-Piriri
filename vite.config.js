// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Punto de entrada principal
        form: path.resolve(__dirname, 'form.html'),
        nosotros: path.resolve(__dirname, 'nosotros.html'),
        obrasedes: path.resolve(__dirname, 'obras-y-sedes.html'),
      },
      // external: ['@fortawesome/fontawesome-svg-core'],
    },
    external: ['googleapis']
  },
  optimizeDeps: {
    include: ['gsap','file-upload-with-preview','@fortawesome/fontawesome-svg-core'],
  },
});