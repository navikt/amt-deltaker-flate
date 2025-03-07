/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
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
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
})
