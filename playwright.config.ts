import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  retries: 0,
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: 'html',
  use: {
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'retalion-on-failure',
  },
});