import { test as base, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CommonPage } from '../pages/CommonPage';
import { users } from '../data/users';
import { Constants } from '../constants/Constants';

/**
 * Hooks sınıfı:
 * Tüm sayfa nesnelerini (Page Object) tek bir yerde üretir ve
 * testlerin ortak "hazırlık" adımlarını (navigate, login) barındırır.
 * Böylece spec dosyalarında ne `new LoginPage(page)` ne de `test.beforeEach` kalır.
 */
export class Hooks {
  readonly page: Page;

  readonly loginPage: LoginPage;
  readonly inventoryPage: InventoryPage;
  readonly cartPage: CartPage;
  readonly checkoutPage: CheckoutPage;
  readonly commonPage: CommonPage;

  constructor(page: Page) {
    this.page = page;

    // Sayfa nesneleri tek noktada oluşturulur (single source of truth)
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.commonPage = new CommonPage(page);
  }

  /** Her testin ortak ilk adımı: uygulamayı (login ekranını) aç */
  async openApp() {
    await this.loginPage.navigateTo();
  }

  /** Verilen kullanıcı ile giriş yapar ve inventory sayfasına ulaşıldığını doğrular */
  async loginAs(username: string, password: string) {
    await this.loginPage.login(username, password);
    await this.inventoryPage.expectUrl(Constants.URLS.INVENTORY);
    await this.inventoryPage.verifyPageLoaded();
  }

  /** En sık kullanılan senaryo: standart kullanıcı ile giriş */
  async loginAsStandardUser() {
    await this.loginAs(users.standardUser.username, users.standardUser.password);
  }

  /** Test sonrası temizlik. Playwright her teste izole context verdiği için
   *  şimdilik ekstra bir işlem gerekmiyor; ihtiyaç olursa (resetAppState, log,
   *  storage temizliği) tek yerden eklenebilir. */
  async teardown() {
    // örn: await this.commonPage.resetAppState();
  }
}

type AppFixtures = {
  /** Sayfa nesneleri hazır + login ekranı açılmış durumda gelir */
  app: Hooks;
  /** `app` + standart kullanıcı ile giriş yapılmış durumda gelir */
  loggedInApp: Hooks;
};

/**
 * Playwright fixture'ları = merkezî beforeEach / afterEach.
 * `use()` çağrısından önceki kod beforeEach, sonraki kod afterEach gibi çalışır.
 */
export const test = base.extend<AppFixtures>({
  app: async ({ page }, use) => {
    const app = new Hooks(page);

    // --- beforeEach ---
    await app.openApp();

    await use(app);

    // --- afterEach ---
    await app.teardown();
  },

  loggedInApp: async ({ app }, use) => {
    // --- beforeEach (login gerektiren süitler için) ---
    await app.loginAsStandardUser();

    await use(app);
  },
});

export { expect, users };
