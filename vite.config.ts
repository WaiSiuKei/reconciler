import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // react({
    //   jsxRuntime: 'classic',
    //   fastRefresh: false,
    // }),
  ],
  // server: { port: 3000 }
});