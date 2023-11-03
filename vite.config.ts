/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { rollupImportMapPlugin } from 'rollup-plugin-import-map'
import { resolve } from 'path'
import importmap from './importmap.json'
import { ConfigEnv, UserConfigExport } from 'vite'
// import mockServer from 'vite-plugin-mock-server'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => ({
  plugins: [
    react(),
    {
      ...rollupImportMapPlugin([importmap]),
      enforce: 'pre',
      apply: 'build'
    },
    // mockServer({
    //   logLevel: 'info',
    //
    // })
  ],
  build: {
    manifest: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/Mikrofrontend.tsx'),
      preserveEntrySignatures: 'exports-only',
      output: {
        entryFileNames: 'bundle.js',
        format: 'es'
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
