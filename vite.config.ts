import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,
    strictPort: true, // Ensures Vite uses the specified port and fails if it's not available
  },
  preview: {
    port: process.env.PORT || 5000,
    strictPort: true,
  },
})
