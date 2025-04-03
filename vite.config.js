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
  },
  optimizeDeps: {
    include: ["react-quill"], 
  },
});
