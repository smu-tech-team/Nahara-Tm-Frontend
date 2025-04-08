import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'https://api.soccersapi.com', 
        changeOrigin: true, 
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
  optimizeDeps: {
    include: ["react-quill"], 
  },
});
