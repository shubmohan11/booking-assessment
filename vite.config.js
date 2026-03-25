import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Base path for built assets. When deploying to GitHub Pages for a project
  // site (https://<user>.github.io/<repo>/) set this to '/<repo>/' so
  // static assets load from the correct subpath.
  base: process.env.VITE_BASE || '/booking-assessment/',
  plugins: [react()],
  // Dev-time proxy to forward local /api requests to the remote API and avoid CORS during development.
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BASE_URL || 'https://dev.natureland.hipster-virtual.com',
        changeOrigin: true,
        secure: false,
        // keep the /api prefix
        rewrite: (path) => path,
      },
    },
  },
})
