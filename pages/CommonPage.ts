import { Page, Locator, expect } from '@playwright/test';

export class CommonPage {
  private page: Page;

  /* Readonly olma sebebi: 
        Eğer bir testin veya başka bir metodun içinde yanlışlıkla bu özellikleri ezmeye çalışırsak, 
        TypeScript derleme anında hata vermesi */
        
  // Header Öğeleri
  readonly menuButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly closeMenuButton: Locator;

  // Yan Menü Linkleri
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.shoppingCartLink = page.locator('.shopping_cart_link');

    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
  }

  async openMenu() {
    await this.menuButton.click();
    await expect(this.allItemsLink).toBeVisible();
  }

  async closeMenu() {
    await this.closeMenuButton.click();
    await expect(this.allItemsLink).not.toBeVisible();
  }

  async navigateToAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetAppStateLink.click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }
}