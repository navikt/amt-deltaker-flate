import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

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
      port: 3004,
      host: '127.0.0.1',
      open: !isOfflineMode,
      proxy: isOfflineMode
        ? {
            '/amt-deltaker-bff': {
              target: 'http://localhost:9002',
              changeOrigin: true
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
