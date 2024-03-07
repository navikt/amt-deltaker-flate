/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default () => ({
  plugins: [react()],
  build: {
    manifest: 'asset-manifest.json',
    outDir: 'build',
    chunkSizeWarningLimit: 1400,
    sourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    teardownTimeout: 1000,
    setupFiles: ['./vitest.setup.ts']
  }
})
