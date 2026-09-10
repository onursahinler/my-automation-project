import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Header ve yan menü gibi TÜM sayfalarda ortak görünen bileşenler.
 * Not: BasePage "teknik" ortaklıkları (page, assertion, navigasyon) tutar;
 * CommonPage ise "görsel/işlevsel" ortak bileşeni (header + sidebar) temsil eder.
 */
export class CommonPage extends BasePage {
  // Header Öğeleri
  readonly menuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly shoppingCartLink: Locator;

  // Yan Menü Linkleri
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    super(page);
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.shoppingCartLink = page.locator('.shopping_cart_link');

    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
  }

  async openMenu() {
    await this.click(this.menuButton);
    await this.expectVisible(this.allItemsLink);
  }

  async closeMenu() {
    await this.click(this.closeMenuButton);
    await this.expectHidden(this.allItemsLink);
  }

  async navigateToAllItems() {
    await this.openMenu();
    await this.click(this.allItemsLink);
  }

  async logout() {
    await this.openMenu();
    await this.click(this.logoutLink);
  }

  async resetAppState() {
    await this.openMenu();
    await this.click(this.resetAppStateLink);
  }

  async goToCart() {
    await this.click(this.shoppingCartLink);
  }
}
