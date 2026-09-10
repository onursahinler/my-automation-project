import fs from 'fs';
import path from 'path';

/**
 * ENV
 * ---
 * Ortama göre DEĞİŞEN parametreler (.env dosyasından okunur).
 * Sabitlerden farkı: bu değerler makineye/ortama göre farklılaşır
 * (local vs CI, dev vs staging, headless vs headed).
 *
 * Node 22'nin yerleşik `process.loadEnvFile()` fonksiyonu kullanılır,
 * bu yüzden ekstra bir `dotenv` bağımlılığına gerek yoktur.
 * .env yoksa (örn. CI ortamı) aşağıdaki varsayılanlar devreye girer.
 */
const envFile = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envFile)) {
  process.loadEnvFile(envFile);
}

const toBool = (value: string | undefined, fallback: boolean): boolean =>
  value === undefined || value === '' ? fallback : value.toLowerCase() === 'true';

const toNumber = (value: string | undefined, fallback: number): number =>
  value === undefined || value === '' ? fallback : Number(value);

export const ENV = {
  /** Testlerin koşacağı ortamın adresi */
  BASE_URL: process.env.BASE_URL ?? 'https://www.saucedemo.com',

  /** Geçerli kullanıcıların ortak parolası — kaynak koda yazılmaz */
  USER_PASSWORD: process.env.USER_PASSWORD ?? 'secret_sauce',

  /** Tarayıcı davranışı */
  HEADLESS: toBool(process.env.HEADLESS, true),
  SLOW_MO: toNumber(process.env.SLOW_MO, 0),

  /** Süre limitleri (ms) */
  ACTION_TIMEOUT: toNumber(process.env.ACTION_TIMEOUT, 15_000),
  TEST_TIMEOUT: toNumber(process.env.TEST_TIMEOUT, 60_000),

  /** Koşum ayarları */
  RETRIES: toNumber(process.env.RETRIES, 0),
  IS_CI: !!process.env.CI,
} as const;
