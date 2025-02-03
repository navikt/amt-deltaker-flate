/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/arbeidsmarkedstiltak/',
  build: {
    outDir: 'build',
    sourcemap: true
  },
  plugins: [react(), tailwindcss()],
  server: {
    port: 3005,
    host: '127.0.0.1',
    open: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    teardownTimeout: 1000,
    setupFiles: ['./vitest.setup.ts'],
    include: ['./src/**/*.test.?(c|m)[jt]s?(x)']
  }
})
