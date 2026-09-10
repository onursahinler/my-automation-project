import { test, expect, users } from '../hooks/hook';

/* Giriş adımı `loggedInApp` fixture'ında (hooks/hook.ts) merkezîleştirildi. */
test.describe('Sauce Demo - Sepet Yönetimi ve Checkout Akışı', () => {

  test('En pahalı 3 ürünü ekle, en ucuzunu sil, tekrar ekle ve satın al', async ({ loggedInApp, page }) => {
    // 1. Pahalıdan ucuza sırala ve en pahalı 3 ürünü sepete ekle
    await loggedInApp.inventoryPage.sortProductsByPriceHighToLow();
    const cheapestOfTopThree = await loggedInApp.inventoryPage.getProductNameByIndex(2);
    await loggedInApp.inventoryPage.addTopExpensiveProductsToCart(3);
    await loggedInApp.inventoryPage.verifyCartBadgeCount('3');

    // 2. Sepete git ve sepetteki en ucuz ürünü sil
    await loggedInApp.commonPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await loggedInApp.cartPage.verifyCartItemCount(3);
    await loggedInApp.cartPage.removeProductByName(cheapestOfTopThree);
    await loggedInApp.cartPage.verifyCartItemCount(2);

    // 3. Inventory'ye dön ve ürünü tekrar ekle
    await loggedInApp.cartPage.continueShopping();
    await loggedInApp.inventoryPage.addProductToCartByName(cheapestOfTopThree);
    await loggedInApp.inventoryPage.verifyCartBadgeCount('3');

    // 4. Sepete git ve checkout sürecini başlat
    await loggedInApp.commonPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await loggedInApp.cartPage.verifyCartItemCount(3);
    await loggedInApp.cartPage.proceedToCheckout();

    // 5. Müşteri bilgilerini doldur
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await loggedInApp.checkoutPage.fillInformation(
      users.customerInfo.firstName,
      users.customerInfo.lastName,
      users.customerInfo.postalCode
    );

    // 6. Siparişi tamamla ve başarı mesajını doğrula
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await loggedInApp.checkoutPage.finishOrder();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await loggedInApp.checkoutPage.verifySuccessMessage('Thank you for your order!');
  });

});
