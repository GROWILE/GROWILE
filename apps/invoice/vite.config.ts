// Configures Vite for the invoice app.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  base: '/',
  build: {
    assetsDir: 'invoice-assets',
  },

  server: {
    watch: {
      usePolling: true,
    },
  },
})