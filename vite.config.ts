import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
