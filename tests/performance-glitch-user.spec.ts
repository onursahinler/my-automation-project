import { test, expect, users } from '../hooks/hook';

/* `app` fixture'ı login ekranını açar; bu süit standart kullanıcı yerine
   performance_glitch_user ile giriş yaptığı için loginAs() kullanılıyor. */
test.describe('Sauce Demo - Performance Glitch User (Yavaş Ağ)', () => {

  test('Yavaş ağ koşullarında giriş yapıp ürün satın alabilmeli', async ({ app, page }) => {
    // 1. Giriş (loginAs içinde inventory URL'i ve ürün listesi görünürlüğü doğrulanır)
    await app.loginAs(users.performanceGlitchUser.username, users.performanceGlitchUser.password);

    // 2. Ürün ekle
    await expect(page.locator('[data-test="inventory-item"]').first()).toBeVisible();
    await app.inventoryPage.addProductToCartByIndex(0);
    await app.inventoryPage.verifyCartBadgeCount('1');

    // 3. Sepete git ve checkout
    await app.commonPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await app.cartPage.proceedToCheckout();

    // 4. Bilgileri doldur
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await app.checkoutPage.fillInformation(
      users.customerInfo.firstName,
      users.customerInfo.lastName,
      users.customerInfo.postalCode
    );

    // 5. Siparişi tamamla
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await app.checkoutPage.finishOrder();

    // 6. Doğrula
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await app.checkoutPage.verifySuccessMessage('Thank you for your order!');
  });

});
