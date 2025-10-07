import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:9002',
    trace: 'on-first-retry',
    browserName: 'chromium',
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'npm run dev',
    port: 9002,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});