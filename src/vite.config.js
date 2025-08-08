// vite.config.js (or .ts/.mjs)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/hen-house-tracker/',   // MUST match your repo name
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Hen House Tracker',
        short_name: 'Hen House',
        start_url: '/hen-house-tracker/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
          { src: '/hen-house-tracker/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/hen-house-tracker/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
})
