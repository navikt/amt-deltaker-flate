import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import { rollupImportMapPlugin } from 'rollup-plugin-import-map'
import { resolve } from 'path'
import importmap from './importmap.json'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		{
			...rollupImportMapPlugin([importmap]),
			enforce: 'pre',
			apply: 'build'
		}
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
		setupFiles: ['./vitest.setup.ts']
	}
})
