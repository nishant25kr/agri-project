import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Only proxy actual backend API calls — NOT top-level page routes
      '/predict':        { target: 'http://localhost:8000', changeOrigin: true },
      '/weather/get-weather': { target: 'http://localhost:8000', changeOrigin: true },
      '/disease/api':    { target: 'http://localhost:8000', changeOrigin: true },
      '/chatbot/send-message': { target: 'http://localhost:8000', changeOrigin: true },
      '/alerts/get-alerts':    { target: 'http://localhost:8000', changeOrigin: true },
      '/send-contact':   { target: 'http://localhost:8000', changeOrigin: true },
      '/media':          { target: 'http://localhost:8000', changeOrigin: true },
    }
  }
})
