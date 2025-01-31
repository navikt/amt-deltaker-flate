import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: 'src/webComponentWrapper.tsx'
    },
    manifest: 'asset-manifest.json',
    outDir: 'build',
    sourcemap: true
  }
})
