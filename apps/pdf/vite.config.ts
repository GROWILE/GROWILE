// Configures Vite for the pdf app.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  base: '/pdf/',
  resolve: {
    alias: {
      // Resolves shared UI source files from the workspace root.
      '@ui': path.resolve(__dirname, '../../../packages/ui/src')
    }
  }
})