import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly productSortSelect: Locator;
  private readonly inventoryItems: Locator;
  private readonly inventoryList: Locator;
  private readonly shoppingCartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.productSortSelect = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.inventoryList = page.locator('.inventory_list');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /** Ürün listesinin render edildiğini doğrular (yavaş kullanıcılar için kritik) */
  async verifyPageLoaded() {
    await this.expectVisible(this.inventoryList);
    await this.expectVisible(this.inventoryItems.first());
  }

  // Ürünleri fiyata göre (yüksekten düşüğe) sırala
  async sortProductsByPriceHighToLow() {
    await this.selectOption(this.productSortSelect, 'hilo');
  }

  // Ürünleri fiyata göre (düşükten yükseğe) sırala
  async sortProductsByPriceLowToHigh() {
    await this.selectOption(this.productSortSelect, 'lohi');
  }

  // Belirli sıradaki ürünün adını döndürür
  async getProductNameByIndex(index: number): Promise<string> {
    return this.getText(this.inventoryItems.nth(index).locator('[data-test="inventory-item-name"]'));
  }

  // Belirli sıradaki ürünü sepete ekler
  async addProductToCartByIndex(index: number) {
    await this.click(this.inventoryItems.nth(index).locator('button:has-text("Add to cart")'));
  }

  // Ürün adına göre sepete ekler
  async addProductToCartByName(productName: string) {
    const item = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    await this.click(item.locator('button:has-text("Add to cart")'));
  }

  // Sıralama sonrası ilk X ürünü (en pahalılar) sepete ekler
  async addTopExpensiveProductsToCart(count: number) {
    for (let i = 0; i < count; i++) {
      await this.addProductToCartByIndex(i);
    }
  }

  // Sepet rozetindeki sayıyı doğrular
  async verifyCartBadgeCount(expectedCount: string) {
    await this.expectText(this.shoppingCartBadge, expectedCount);
  }

  // Ürünün sepetten kaldırıldığını doğrula — "Add to cart" butonu tekrar görünür olmalı
  async verifyProductHasAddToCartButton(index: number) {
    await this.expectVisible(this.inventoryItems.nth(index).locator('button:has-text("Add to cart")'));
  }
}
