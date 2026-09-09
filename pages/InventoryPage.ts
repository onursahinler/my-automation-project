import { Locator, Page, expect } from '@playwright/test';

export class InventoryPage {
  private page: Page;
  private productSortSelect: Locator;
  private inventoryItems: Locator;
  private shoppingCartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productSortSelect = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  // Ürünleri fiyata göre (yüksekten düşüğe) sıralayan fonksiyon
  async sortProductsByPriceHighToLow() {
    // Playwright selectOption ile dropdown menüden değer seçmek çok kolaydır
    // 'hilo' değeri sitesinin kaynak kodunda "Price (high to low)" seçeneğine denk gelir
    await this.productSortSelect.selectOption('hilo');
  }

  // Ürünleri fiyata göre (düşükten yükseğe) sıralayan fonksiyon
  async sortProductsByPriceLowToHigh() {
    await this.productSortSelect.selectOption('lohi');
  }

  // Belirli sıradaki ürünün adını döndürür
  async getProductNameByIndex(index: number): Promise<string> {
    return this.inventoryItems.nth(index).locator('[data-test="inventory-item-name"]').innerText();
  }

  // Belirli sıradaki ürünü sepete ekler
  async addProductToCartByIndex(index: number) {
    const addToCartButton = this.inventoryItems.nth(index).locator('button:has-text("Add to cart")');
    await addToCartButton.click();
  }

  // Ürün adına göre sepete ekler
  async addProductToCartByName(productName: string) {
    const item = this.inventoryItems.filter({
      has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }),
    });
    await item.locator('button:has-text("Add to cart")').click();
  }

  // Sayfadaki en pahalı ilk X adet ürünü sepete ekleyen fonksiyon
  async addTopExpensiveProductsToCart(count: number) {
    for (let i = 0; i < count; i++) {
      // Sıralama yapıldığı için ilk ürünler en pahalı olanlar olacak
      // nth(i) ile sırasıyla 0., 1., 2. ürünü yakalıyoruz
      const currentItem = this.inventoryItems.nth(i);
      
      // O ürün kartının içindeki "Add to cart" butonunu bulup tıklıyoruz
      const addToCartButton = currentItem.locator('button:has-text("Add to cart")');
      await addToCartButton.click();
    }
  }

  // Sepetteki ürün sayısını doğrulayan fonksiyon (Assertion)
  async verifyCartBadgeCount(expectedCount: string) {
    await expect(this.shoppingCartBadge).toBeVisible();
    await expect(this.shoppingCartBadge).toHaveText(expectedCount);
  }

  // Sepet sayfasına gitmek için sepet ikonuna tıklama fonksiyonu
  async goToCart() {
    await this.shoppingCartBadge.click();
  }

  // Ürünün sepetten kaldırıldığını doğrula — "Add to cart" butonu tekrar görünür olmalı
  async verifyProductHasAddToCartButton(index: number) {
    const addToCartButton = this.inventoryItems.nth(index).locator('button:has-text("Add to cart")');
    await expect(addToCartButton).toBeVisible();
  }
}