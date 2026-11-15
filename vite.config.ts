import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' faz os caminhos funcionarem em qualquer hospedagem (Vercel, Netlify, GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [react()],
});
