import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    // react({
    //   jsxRuntime: 'classic',
    //   fastRefresh: false,
    // }),
  ],
  build: {
    outDir: 'docs'
  }
  // server: { port: 3000 }
});
