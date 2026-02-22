import { defineConfig, devices } from '@playwright/test';

const APP_HOST = '127.0.0.1';
const APP_PORT = 4174;
const APP_BASE_URL = `http://${APP_HOST}:${APP_PORT}`;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? 'https://example.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'public-anon-key';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: APP_BASE_URL,
    trace: 'on-first-retry'
  },
  webServer: {
    command: `VITE_SUPABASE_URL=${SUPABASE_URL} VITE_SUPABASE_PUBLISHABLE_KEY=${SUPABASE_KEY} npm run dev -- --host ${APP_HOST} --port ${APP_PORT} --strictPort`,
    url: APP_BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
