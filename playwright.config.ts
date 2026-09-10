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

  /* Raporlayıcılar: terminal + Playwright HTML + Allure (+ CI'da GitHub annotation) */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        /* Playwright aksiyonlarını, hook'ları ve assertion'ları otomatik adım olarak yazar */
        detail: true,
        /* Suite'leri dosya adlarından türetir */
        suiteTitle: true,
        /* Raporun ana sayfasında görünecek ortam bilgisi */
        environmentInfo: {
          BASE_URL: ENV.BASE_URL,
          HEADLESS: String(ENV.HEADLESS),
          CI: String(ENV.IS_CI),
          Node: process.version,
          OS: `${process.platform} ${process.arch}`,
        },
        /* Hataları sınıflandırma — raporda "Categories" sekmesinde gruplanır */
        categories: [
          {
            name: 'Timeout hataları',
            messageRegex: '.*Timeout.*exceeded.*',
            matchedStatuses: ['broken', 'failed'],
          },
          {
            name: 'Element bulunamadı',
            messageRegex: '.*(strict mode violation|waiting for locator).*',
            matchedStatuses: ['failed', 'broken'],
          },
          {
            name: 'Assertion hataları',
            messageRegex: '.*expect.*',
            matchedStatuses: ['failed'],
          },
        ],
      },
    ],
    ...(ENV.IS_CI ? [['github'] as const] : []),
  ],

  use: {
    /* page.goto('/') gibi göreli adreslerin çözümleneceği kök adres */
    baseURL: ENV.BASE_URL,

    /* Tek bir aksiyonun (click, fill...) süre limiti */
    actionTimeout: ENV.ACTION_TIMEOUT,

    headless: ENV.HEADLESS,

    /* Kanıt toplama — üçü de Allure raporuna otomatik eklenir */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

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
