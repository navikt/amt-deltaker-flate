import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: 'src/webComponentWrapper.tsx'
    },
    manifest: 'asset-manifest.json',
    outDir: 'build',
    sourcemap: true
  }
})
