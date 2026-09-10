import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Constants } from '../constants/Constants';

export class CartPage extends BasePage {
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
  }

  // Checkout sayfasına ilerle
  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }

  // Inventory sayfasına geri dön
  async continueShopping() {
    await this.click(this.continueShoppingButton);
    await this.expectUrl(Constants.URLS.INVENTORY);
  }

  // Sepetteki belirli sıradaki ürünü kaldır (0'dan başlar)
  async removeProductByIndex(index: number) {
    await this.click(this.cartItems.nth(index).locator('button[data-test^="remove-"]'));
  }

  // Sepetteki ürünü adına göre kaldır
  async removeProductByName(productName: string) {
    const cartItem = this.cartItems.filter({ hasText: productName });
    await this.click(cartItem.locator('button[data-test^="remove-"]'));
  }

  // Sepetteki ürün sayısını doğrula
  async verifyCartItemCount(expectedCount: number) {
    await this.expectCount(this.cartItems, expectedCount);
  }
}
