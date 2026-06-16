import { Locator, Page, expect } from '@playwright/test';

export class CheckoutPage {
  private page: Page;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private postalCodeInput: Locator;
  private continueButton: Locator;
  private finishButton: Locator;
  private completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  // Müşteri bilgilerini doldurma fonksiyonu
  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  // Siparişi tamamlama fonksiyonu
  async finishOrder() {
    await this.finishButton.click();
  }

  // Başarı mesajını doğrulama fonksiyonu (final assertion)
  async verifySuccessMessage(expectedMessage: string) {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText(expectedMessage);
  }
}