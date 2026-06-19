import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        skipWaiting: false,
        clientsClaim: true
      },
      manifest: {
        name: 'SchoolQuest',
        short_name: 'SchoolQuest',
        description: 'Adaptive school prep for Emilia',
        theme_color: '#6b21a8',
        background_color: '#0f0a1e',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
