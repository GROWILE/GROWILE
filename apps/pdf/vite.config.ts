import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 👇 packages/ui-ku kulla irukkura src-a point panrom
      '@ui': path.resolve(__dirname, '../../../packages/ui/src')
    }
  }
})