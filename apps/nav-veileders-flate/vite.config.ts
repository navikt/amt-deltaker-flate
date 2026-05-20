import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'
import tailwindcss from '@tailwindcss/vite'

async function resolveLocalDevJwt(): Promise<string | undefined> {
  const tokenEndpoint = 'http://localhost:9000/azure/token'

  const formBody = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: 'frontend-client-id',
    client_secret: 'frontend-secret',
    aud: 'amt-deltaker-bff'
  })

  let response: Response
  try {
    response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    })
  } catch (error) {
    console.warn(
      `[vite] Failed to fetch local JWT from ${tokenEndpoint}:`,
      error
    )
    console.warn('[vite] Continuing without Authorization header.')
    return undefined
  }

  if (!response.ok) {
    console.warn(`[vite] Token endpoint returned HTTP ${response.status}.`)
    console.warn('[vite] Continuing without Authorization header.')
    return undefined
  }

  const data = (await response.json()) as { access_token?: string }
  if (!data.access_token) {
    console.warn('[vite] Missing access_token in token response.')
    console.warn('[vite] Continuing without Authorization header.')
    return undefined
  }

  return data.access_token
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const localDevJwt = await resolveLocalDevJwt()

  return {
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
          rewrite: (path: string) => path.replace(/^\/amt-deltaker-bff/, ''),
          headers: localDevJwt
            ? { Authorization: `Bearer ${localDevJwt}` }
            : undefined
        }
      }
    },
    build: {
      outDir: 'build',
      sourcemap: true
    }
  }
})
