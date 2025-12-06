import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base: "./"' es CRUCIAL para que funcione en GitHub Pages o cualquier subcarpeta
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})