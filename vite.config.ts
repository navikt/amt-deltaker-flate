/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import { rollupImportMapPlugin } from 'rollup-plugin-import-map'
import { resolve } from 'path'
import importmap from './importmap.json'
import { viteMockServe } from 'vite-plugin-mock'
import { ConfigEnv, UserConfigExport } from 'vite'

// https://vitejs.dev/config/
export default ({ command }: ConfigEnv): UserConfigExport => ({
  plugins: [
    react(),
    {
      ...rollupImportMapPlugin([importmap]),
      enforce: 'pre',
      apply: 'build'
    },
    viteMockServe({
      mockPath: 'mock',
      localEnabled: command === 'serve'
    })
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
