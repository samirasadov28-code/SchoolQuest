import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    // Transpile for older Safari / iPad (iOS 12+, Safari 12+)
    legacy({
      targets: ['ios >= 12', 'safari >= 12', 'chrome >= 70'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MiB (covers legacy chunks)
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-cache', expiration: { maxEntries: 50 } },
          },
        ],
      },
      manifest: {
        name: 'SchoolQuest',
        short_name: 'SchoolQuest',
        description: 'SchoolQuest — Adaptive school prep with Irish mythology, gamification & Emilia',
        theme_color: '#6b21a8',
        background_color: '#0f0a1e',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  build: {
    // Split vendor code so the initial chunk is smaller
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor':   ['react', 'react-dom', 'react-router-dom'],
          'supabase':       ['@supabase/supabase-js'],
          'state':          ['zustand'],
        },
      },
    },
  },
})
