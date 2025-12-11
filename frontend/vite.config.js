import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Keep the frontend port as 5173
    proxy: {
      // This is the new proxy configuration
      '/api': {
        target: 'http://localhost:8000', // Forward API requests to this target
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Don't verify SSL certs if you're not using HTTPS
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-icons', 'react-hot-toast', 'clsx', 'tailwind-merge'],
          'state-vendor': ['zustand'],
          'socket-vendor': ['socket.io-client'],
        },
      },
    },
  },
})

