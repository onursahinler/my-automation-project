import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  private page: Page;
  private checkoutButton: Locator;
  private continueShoppingButton: Locator;
  private cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  // Checkout sayfasına ilerleme fonksiyonu
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  // Inventory sayfasına geri dön
  async continueShopping() {
    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/.*inventory.html/);
  }

  // Sepetteki belirli sıradaki ürünü kaldır (0'dan başlar)
  async removeProductByIndex(index: number) {
    const cartItem = this.cartItems.nth(index);
    const removeButton = cartItem.locator('button[data-test^="remove-"]');
    await removeButton.click();
  }

  // Sepetteki ürün adına göre kaldır
  async removeProductByName(productName: string) {
    const cartItem = this.cartItems.filter({
      hasText: productName,
    });
    await cartItem.locator('button[data-test^="remove-"]').click();
  }

  // Sepetteki ürün sayısını doğrula
  async verifyCartItemCount(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }
}