import { Locator, Page, expect } from '@playwright/test';

/**
 * BasePage
 * ---------
 * Tüm Page Object sınıflarının atası. Her sayfada tekrar eden üç şeyi barındırır:
 *   1) `page` nesnesinin saklanması (state yönetimi)
 *   2) Navigasyon yardımcıları
 *   3) Ortak etkileşim ve doğrulama (assertion) sarmalayıcıları
 *
 * Böylece alt sınıflar sadece KENDİ locator'larını ve KENDİ iş kurallarını tanımlar.
 * `abstract`: doğrudan `new BasePage(page)` yapılamaz, yalnızca miras alınır.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /* ---------------- Navigasyon ---------------- */

  /** Config'teki baseURL'e göre göreli yolla gezinir. Örn: goto('/') */
  async goto(path: string = '/') {
    await this.page.goto(path);
  }

  async reload() {
    await this.page.reload();
  }

  /** Aktif sayfanın URL'ini doğrular */
  async expectUrl(url: string | RegExp) {
    await expect(this.page).toHaveURL(url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /* ---------------- Etkileşim ---------------- */

  protected async click(locator: Locator) {
    await locator.click();
  }

  protected async fill(locator: Locator, value: string) {
    await locator.fill(value);
  }

  protected async selectOption(locator: Locator, value: string) {
    await locator.selectOption(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    return (await locator.innerText()).trim();
  }

  /* ---------------- Doğrulama (Assertion) ---------------- */

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async expectHidden(locator: Locator) {
    await expect(locator).toBeHidden();
  }

  /** Elementin görünür olduğunu VE metninin birebir eşleştiğini doğrular */
  async expectText(locator: Locator, expected: string) {
    await expect(locator).toBeVisible();
    await expect(locator).toHaveText(expected);
  }

  /** Elementin görünür olduğunu VE metni İÇERDİĞİNİ doğrular */
  async expectContainsText(locator: Locator, expected: string) {
    await expect(locator).toBeVisible();
    await expect(locator).toContainText(expected);
  }

  async expectCount(locator: Locator, expected: number) {
    await expect(locator).toHaveCount(expected);
  }
}
