import { test, expect, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../data/users.json';

test.describe('Sauce Demo - Performance Glitch User (Yavaş Ağ)', () => {
  test('Yavaş ağ koşullarında giriş yapıp ürün satın alabilmeli', async ({ page, context }) => {

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Giriş
    await loginPage.navigateTo();
    await loginPage.login(users.performanceGlitchUser.username, users.performanceGlitchUser.password);
    
    /* Giriş yaparken bir gecikme olduğu için
    inventory sayfasındaki itemların görünürlüğünü kontrol etmek gerekiyor */
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();

    // 2. Ürün ekle
    await expect(page.locator('[data-test="inventory-item"]').first()).toBeVisible();
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.verifyCartBadgeCount('1');

    // 3. Sepete git ve checkout
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await cartPage.proceedToCheckout();

    // 4. Bilgileri doldur
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await checkoutPage.fillInformation(
      users.customerInfo.firstName,
      users.customerInfo.lastName,
      users.customerInfo.postalCode
    );

    // 5. Siparişi tamamla
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await checkoutPage.finishOrder();

    // 6. Doğrula
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await checkoutPage.verifySuccessMessage('Thank you for your order!');
  });
});