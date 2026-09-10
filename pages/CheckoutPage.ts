import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomerInfo } from '../utils/DataFactory';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
  }

  // Müşteri bilgilerini doldur ve devam et
  async fillInformation(customer: CustomerInfo) {
    await this.fill(this.firstNameInput, customer.firstName);
    await this.fill(this.lastNameInput, customer.lastName);
    await this.fill(this.postalCodeInput, customer.postalCode);
    await this.click(this.continueButton);
  }

  // Siparişi tamamla
  async finishOrder() {
    await this.click(this.finishButton);
  }

  // Başarı mesajını doğrula (final assertion)
  async verifySuccessMessage(expectedMessage: string) {
    await this.expectText(this.completeHeader, expectedMessage);
  }
}
