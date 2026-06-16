import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  private page: Page;
  private checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  // Checkout sayfasına ilerleme fonksiyonu
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}