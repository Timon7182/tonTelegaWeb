import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    strictPort: true,
    host: true, // Ensures the server is accessible externally
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.pem')),
    },
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
    strictPort: true,
    host: true, // Ensures the preview server is accessible externally
  },
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
//     strictPort: true,
//     host: true, // Ensures the server is accessible externally
//   },
//   preview: {
//     port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
//     strictPort: true,
//     host: true, // Ensures the preview server is accessible externally
//   },
// })