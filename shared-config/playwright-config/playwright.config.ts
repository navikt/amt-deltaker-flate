import { defineConfig, devices } from '@playwright/test'

type PlaywrightConfigOptions = {
  port: number
}

export const createPlaywrightConfig = ({ port }: PlaywrightConfigOptions) => {
  const baseURL = `http://127.0.0.1:${port}`

  return defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
      baseURL,
      trace: 'on-first-retry'
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] }
      }
    ],
    webServer: {
      command: 'pnpm run start --host 127.0.0.1',
      url: baseURL,
      reuseExistingServer: !process.env.CI
    }
  })
}
