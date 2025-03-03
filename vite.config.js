import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env, // Ensures environment variables work properly
    'process.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_CLERK_PUBLISHABLE_KEY),
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  optimizeDeps: {
    include: ["react-quill"]
  },
 
  
});
