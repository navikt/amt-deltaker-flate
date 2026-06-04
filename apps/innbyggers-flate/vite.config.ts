import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isOfflineMode = mode === 'offline'
  return {
    base: '/arbeidsmarkedstiltak/',
    build: {
      outDir: 'build',
      sourcemap: true
    },
    plugins: [react(), tailwindcss()],
    server: {
      port: 3005,
      host: '127.0.0.1',
      open: !isOfflineMode,
      proxy: isOfflineMode
        ? {
            // Sender request via sim-nav, som legger på autentiseringstoken mm.
            '/arbeidsmarkedstiltak/amt-deltaker-bff': {
              target: 'http://localhost:9100',
              changeOrigin: true,
              headers: {
                'x-local-app-source': 'innbyggers-flate'
              },
              rewrite: (path) => path.replace(/^\/arbeidsmarkedstiltak/, '')
            }
          }
        : undefined
    },
    test: {
      globals: true,
      environment: 'jsdom',
      teardownTimeout: 1000,
      setupFiles: ['./vitest.setup.ts'],
      include: ['./src/**/*.test.?(c|m)[jt]s?(x)']
    }
  }
})
