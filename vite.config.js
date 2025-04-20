import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
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
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,  
        }),
      ],
    },
  },
});
