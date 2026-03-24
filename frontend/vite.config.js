import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Proxy Django API calls during development
      '/predict': { target: 'http://localhost:8000', changeOrigin: true },
      '/weather': { target: 'http://localhost:8000', changeOrigin: true },
      '/disease': { target: 'http://localhost:8000', changeOrigin: true },
      '/chatbot': { target: 'http://localhost:8000', changeOrigin: true },
      '/alerts': { target: 'http://localhost:8000', changeOrigin: true },
      '/send-contact': { target: 'http://localhost:8000', changeOrigin: true },
      '/media': { target: 'http://localhost:8000', changeOrigin: true },
    }
  }
})
