import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  //base: process.env.BASE || "/arbeidsmarkedstiltak/",
  build: {
    manifest: 'asset-manifest.json',
    outDir: 'build',
    chunkSizeWarningLimit: 1400,
    sourcemap: true
  },
  server: {
    port: 3005,
    open: true
  },
  //  base: process.env.BASE || '/arbeidsmarkedstiltak/',
  plugins: [react()]
})
