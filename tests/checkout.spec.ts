import { test, expect, users } from '../hooks/hook';

/* Giriş adımı `loggedInApp` fixture'ında (hooks/hook.ts) merkezîleştirildi. */
test.describe('Sauce Demo - Uçtan Uca Alışveriş Akışı', () => {

  test('En Pahalı İki Ürünü Satın Alma ve Alışverişi Tamamlama', async ({ loggedInApp, page }) => {
    // 1. Adım: Ürünleri fiyata göre sırala ve en pahalı 2 tanesini sepete ekle
    await loggedInApp.inventoryPage.sortProductsByPriceHighToLow();
    await loggedInApp.inventoryPage.addTopExpensiveProductsToCart(2);
    await loggedInApp.inventoryPage.verifyCartBadgeCount('2');

    // 2. Adım: Sepete git ve Checkout sürecini başlat
    await loggedInApp.commonPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await loggedInApp.cartPage.proceedToCheckout();

    // 3. Adım: Müşteri bilgilerini doldur ve devam et
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await loggedInApp.checkoutPage.fillInformation(
      users.customerInfo.firstName,
      users.customerInfo.lastName,
      users.customerInfo.postalCode
    );

    // 4. Adım: Sipariş özetini onayla ve alışverişi bitir
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await loggedInApp.checkoutPage.finishOrder();

    // 5. Adım: Başarı mesajını doğrula (Final Assertion)
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await loggedInApp.checkoutPage.verifySuccessMessage('Thank you for your order!');
  });

});
