// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Punto de entrada principal
        form: path.resolve(__dirname, 'form.html'),
        // indexnuevo: path.resolve(__dirname, 'index-vite.html'),
        nosotros: path.resolve(__dirname, 'nosotros.html'),
        obrasedes: path.resolve(__dirname, 'obras-y-sedes.html'),
      },
    },
  },
});