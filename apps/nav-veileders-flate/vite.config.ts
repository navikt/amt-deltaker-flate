import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

const DUMMY_JWT =
  'eyJraWQiOiJhenVyZSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJhdWQiOiJsb2NhbC1jbGllbnQtaWQiLCJuYmYiOjE3Nzg2NzMzMTMsIk5BVmlkZW50IjoiWjEyMzQ1NiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMC9henVyZSIsImdyb3VwcyI6W10sIm9pZCI6IjExMTExMTExLTExMTEtMTExMS0xMTExLTExMTExMTExMTExMSIsImV4cCI6MTc3ODY3NjkxMywiaWF0IjoxNzc4NjczMzEzLCJqdGkiOiIxNzNlMjE5NS0zMGEzLTRjNDUtYWY2YS05ZjRmYWIwNGM2ZGMifQ.dj0DRffif4TgFFMGcJmVPPY-4nXZAHq7sYjkPkxEPey9-0lN4Km15tJfGveO-E6G7OPKEE1ltfAotu4RXW4wKG6ZW7uzOJke0aReJHT2hmU4rGDhB1f4CYCf5K9RFWFRJXcC73CQPAnQkUwNTGt9MyZHHD66leddRJCfUT6QCQS35Xecr9Nlqouk422n4xtc0ElRCauNykANKpOLBjwXqyWzkyY3YjsVhGW4GvfgXYvIwsjHEDD7Zdq4IuXBI_3pfIEOiBNkNMetnlBOhcLpAMCesGL8kaMfEzyV82wD1GLsPcJvCPG75D4jFrtlr1W5i4kdhR2aDaeBMOQIa2TdZA'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    teardownTimeout: 1000,
    setupFiles: ['./vitest.setup.ts'],
    include: ['./src/**/*.test.?(c|m)[jt]s?(x)']
  },
  server: {
    port: 3004,
    host: '127.0.0.1',
    open: true,
    proxy: {
      '/amt-deltaker-bff': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/amt-deltaker-bff/, ''),
        headers: { Authorization: `Bearer ${DUMMY_JWT}` }
      }
    }
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
})
