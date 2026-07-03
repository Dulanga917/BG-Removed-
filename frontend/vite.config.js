import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Use repo name as base for GitHub Pages
  // e.g. https://dulanga917.github.io/BG-Removed-/
  base: process.env.NODE_ENV === 'production' ? '/BG-Removed-/' : '/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})
