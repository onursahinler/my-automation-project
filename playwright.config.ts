import { defineConfig, devices } from '@playwright/test';
import { ENV } from './config/env';

/**
 * Ortama bağlı tüm değerler config/env.ts üzerinden .env dosyasından gelir.
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Tek bir testin toplam süre limiti */
  timeout: ENV.TEST_TIMEOUT,

  /* Dosyalardaki testleri paralel çalıştır */
  fullyParallel: true,

  /* CI'da yanlışlıkla bırakılan test.only build'i düşürsün */
  forbidOnly: ENV.IS_CI,

  /* Tekrar deneme: CI'da 2, local'de .env'deki değer */
  retries: ENV.IS_CI ? 2 : ENV.RETRIES,

  /* CI'da paralelliği kapat */
  workers: ENV.IS_CI ? 1 : undefined,

  reporter: 'html',

  use: {
    /* page.goto('/') gibi göreli adreslerin çözümleneceği kök adres */
    baseURL: ENV.BASE_URL,

    /* Tek bir aksiyonun (click, fill...) süre limiti */
    actionTimeout: ENV.ACTION_TIMEOUT,

    headless: ENV.HEADLESS,

    /* İlk tekrar denemede trace topla */
    trace: 'on-first-retry',

    launchOptions: {
      slowMo: ENV.SLOW_MO,
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
