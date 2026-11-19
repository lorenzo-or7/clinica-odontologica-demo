import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/clinica-odontologica-demo/',
  // O chunk 3D (three + R3F, ~950 kB) é carregado sob demanda apenas perto da seção Smile Sculpture.
  build: { target: 'es2022', chunkSizeWarningLimit: 1000 },
});
