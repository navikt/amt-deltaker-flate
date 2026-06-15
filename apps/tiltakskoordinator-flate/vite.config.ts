import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isOfflineMode = mode === 'offline'

  return {
    plugins: [react(), tailwindcss()],
    test: {
      globals: true,
      environment: 'jsdom',
      teardownTimeout: 1000,
      setupFiles: ['./vitest.setup.ts'],
      include: ['./src/**/*.test.?(c|m)[jt]s?(x)']
    },
    server: {
      port: 3003,
      host: '127.0.0.1',
      open: !isOfflineMode,
      proxy: isOfflineMode
        ? {
            '/amt-deltaker-bff': {
              // Sender request via sim-nav, som legger på autentiseringstoken mm.
              target: 'http://localhost:9100',
              changeOrigin: true,
              headers: {
                'x-local-app-source': 'tiltakskoordinator-flate'
              }
            }
          }
        : undefined
    },
    build: {
      outDir: 'build',
      sourcemap: true
    }
  }
})
