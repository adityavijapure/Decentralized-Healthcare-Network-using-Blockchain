import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This helps if you are getting CSP errors on local network/host
    hmr: {
      overlay: true,
    },
  },
  build: {
    // Ensures production builds don't use eval for sourcemaps
    sourcemap: false, 
  },
  // THE KEY FIX: Changes how source maps are generated in dev mode
  css: {
    devSourcemap: false,
  },
})