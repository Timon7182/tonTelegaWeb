import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ensure process.env is typed correctly
interface ProcessEnv {
  PORT?: string;
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
    strictPort: true, // Ensures Vite uses the specified port and fails if it's not available
  },
  preview: {
    port: port,
    strictPort: true,
  },
})
