import { test, expect } from '../hooks/hook';
import { Constants } from '../constants/Constants';
import { DataFactory } from '../utils/DataFactory';
import { AllureHelper, Severity } from '../utils/AllureHelper';

/* Giriş adımı `loggedInApp` fixture'ında (hooks/hook.ts) merkezîleştirildi. */
test.describe('Sauce Demo - Sepet Yönetimi ve Checkout Akışı', () => {

  test('En pahalı 3 ürünü ekle, en ucuzunu sil, tekrar ekle ve satın al', { tag: '@regression' }, async ({ loggedInApp, page }) => {
    await AllureHelper.meta({ epic: 'Sauce Demo E-Ticaret', feature: 'Sepet Yönetimi', story: 'Sepette ürün silme ve tekrar ekleme', severity: Severity.CRITICAL });
    const customer = DataFactory.customerInfo();
    await AllureHelper.attachJson('Üretilen müşteri bilgisi', customer);
    // 1. Pahalıdan ucuza sırala ve en pahalı 3 ürünü sepete ekle
    await loggedInApp.inventoryPage.sortProductsByPriceHighToLow();
    const cheapestOfTopThree = await loggedInApp.inventoryPage.getProductNameByIndex(2);
    await loggedInApp.inventoryPage.addTopExpensiveProductsToCart(3);
    await loggedInApp.inventoryPage.verifyCartBadgeCount('3');

    // 2. Sepete git ve sepetteki en ucuz ürünü sil
    await loggedInApp.commonPage.goToCart();
    await expect(page).toHaveURL(Constants.URLS.CART);
    await loggedInApp.cartPage.verifyCartItemCount(3);
    await loggedInApp.cartPage.removeProductByName(cheapestOfTopThree);
    await loggedInApp.cartPage.verifyCartItemCount(2);

    // 3. Inventory'ye dön ve ürünü tekrar ekle
    await loggedInApp.cartPage.continueShopping();
    await loggedInApp.inventoryPage.addProductToCartByName(cheapestOfTopThree);
    await loggedInApp.inventoryPage.verifyCartBadgeCount('3');

    // 4. Sepete git ve checkout sürecini başlat
    await loggedInApp.commonPage.goToCart();
    await expect(page).toHaveURL(Constants.URLS.CART);
    await loggedInApp.cartPage.verifyCartItemCount(3);
    await loggedInApp.cartPage.proceedToCheckout();

    // 5. Müşteri bilgilerini doldur
    await expect(page).toHaveURL(Constants.URLS.CHECKOUT_STEP_ONE);
    await loggedInApp.checkoutPage.fillInformation(customer);

    // 6. Siparişi tamamla ve başarı mesajını doğrula
    await expect(page).toHaveURL(Constants.URLS.CHECKOUT_STEP_TWO);
    await loggedInApp.checkoutPage.finishOrder();
    await expect(page).toHaveURL(Constants.URLS.CHECKOUT_COMPLETE);
    await loggedInApp.checkoutPage.verifySuccessMessage(Constants.MESSAGES.ORDER_SUCCESS);
  });

});
