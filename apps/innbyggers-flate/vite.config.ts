/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE || '/arbeidsmarkedstiltak/',
  build: {
    manifest: 'asset-manifest.json',
    outDir: 'build',
    chunkSizeWarningLimit: 1400,
    sourcemap: true
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    teardownTimeout: 1000,
    setupFiles: ['./vitest.setup.ts']
  }
})
