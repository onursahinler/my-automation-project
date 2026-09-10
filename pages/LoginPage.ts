import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Constants } from '../constants/Constants';

export class LoginPage extends BasePage {
  // Sadece bu sayfaya ait locator'lar. `page` alanı ve assertion'lar BasePage'de.
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page); // `this.page = page` ataması BasePage'de yapılır
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Login sayfasına git (baseURL config'ten gelir) */
  async navigateTo() {
    await this.goto(Constants.PATHS.LOGIN);
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /** Login ekranının yüklendiğini doğrular */
  async verifyPageLoaded() {
    await this.expectVisible(this.loginButton);
  }

  async verifyErrorMessage(expectedText: string) {
    await this.expectContainsText(this.errorMessage, expectedText);
  }
}
