import { Locator, Page, expect } from '@playwright/test';

export class LoginPage {
  // Değişkenler ve tipleri
  private page: Page;
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private errorMessage: Locator;

  /* Constructor, bir sınıftan (Class) yeni bir nesne (instance) üretildiğinde 
  otomatik olarak ilk çalışan özel bir fonksiyondur. Sınıfın "başlangıç ayarlarını" 
  (initialization) yapmak için kullanılır. */

  /* Locator, Playwright'ın web sayfasındaki HTML elementlerini 
  (buton, input, metin vb.) bulabilmesi, izleyebilmesi ve onlarla etkileşime geçebilmesi 
  için kullandığı gelişmiş bir arama/yakalama motorudur. */
  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Sayfaya yönlendirme
  async navigateTo() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // 4. Login 
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  // 5. Hata mesajını doğrulama fonksiyonu
  async verifyErrorMessage(expectedText: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}