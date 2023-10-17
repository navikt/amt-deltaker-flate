import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

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
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./vitest.setup.ts']
	}
})
