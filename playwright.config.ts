import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/qa',
  timeout: 30_000,
  expect: { timeout: 15_000 },
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    headless: true,
    baseURL: 'http://localhost:8080',
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
  },
  webServer: {
    command: 'python -m http.server 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 375, height: 812 } },
    },
  ],
});
