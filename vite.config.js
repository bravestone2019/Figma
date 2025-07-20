import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  optimizeDeps: {
    include: ['jspdf', 'html2canvas']
  },
  plugins: [react()]
})
