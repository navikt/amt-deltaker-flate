/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { ConfigEnv, UserConfigExport } from 'vite'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => ({
  plugins: [react()],
  build: {
    manifest: 'asset-manifest.json',
    outDir: 'build',
    chunkSizeWarningLimit: 1400,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js'
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    teardownTimeout: 1000,
    setupFiles: ['./vitest.setup.ts']
  }
})
