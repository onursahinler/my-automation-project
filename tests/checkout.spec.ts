import { test, expect } from '../hooks/hook';
import { Constants } from '../constants/Constants';
import { DataFactory } from '../utils/DataFactory';
import { AllureHelper, Severity } from '../utils/AllureHelper';

/* Giriş adımı `loggedInApp` fixture'ında (hooks/hook.ts) merkezîleştirildi. */
test.describe('Sauce Demo - Uçtan Uca Alışveriş Akışı', () => {

  test('En Pahalı İki Ürünü Satın Alma ve Alışverişi Tamamlama', { tag: ['@smoke', '@regression'] }, async ({ loggedInApp, page }) => {
    await AllureHelper.meta({ epic: 'Sauce Demo E-Ticaret', feature: 'Checkout', story: 'Uçtan uca satın alma', severity: Severity.BLOCKER });
    const customer = DataFactory.customerInfo();
    await AllureHelper.attachJson('Üretilen müşteri bilgisi', customer);
    // 1. Adım: Ürünleri fiyata göre sırala ve en pahalı 2 tanesini sepete ekle
    await loggedInApp.inventoryPage.sortProductsByPriceHighToLow();
    await loggedInApp.inventoryPage.addTopExpensiveProductsToCart(2);
    await loggedInApp.inventoryPage.verifyCartBadgeCount('2');

    // 2. Adım: Sepete git ve Checkout sürecini başlat
    await loggedInApp.commonPage.goToCart();
    await expect(page).toHaveURL(Constants.URLS.CART);
    await loggedInApp.cartPage.proceedToCheckout();

    // 3. Adım: Müşteri bilgilerini doldur ve devam et
    await expect(page).toHaveURL(Constants.URLS.CHECKOUT_STEP_ONE);
    await loggedInApp.checkoutPage.fillInformation(customer);

    // 4. Adım: Sipariş özetini onayla ve alışverişi bitir
    await expect(page).toHaveURL(Constants.URLS.CHECKOUT_STEP_TWO);
    await loggedInApp.checkoutPage.finishOrder();

    // 5. Adım: Başarı mesajını doğrula (Final Assertion)
    await expect(page).toHaveURL(Constants.URLS.CHECKOUT_COMPLETE);
    await loggedInApp.checkoutPage.verifySuccessMessage(Constants.MESSAGES.ORDER_SUCCESS);
  });

});
