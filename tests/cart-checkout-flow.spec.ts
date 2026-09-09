import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../data/users.json';

test.describe('Sauce Demo - Sepet Yönetimi ve Checkout Akışı', () => {

  test('En pahalı 3 ürünü ekle, en ucuzunu sil, tekrar ekle ve satın al', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Başarılı giriş
    await loginPage.navigateTo();
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);

    // 2. Pahalıdan ucuza sırala ve en pahalı 3 ürünü sepete ekle
    await inventoryPage.sortProductsByPriceHighToLow();
    const cheapestOfTopThree = await inventoryPage.getProductNameByIndex(2);
    await inventoryPage.addTopExpensiveProductsToCart(3);
    await inventoryPage.verifyCartBadgeCount('3');

    // 3. Sepete git ve sepetteki en ucuz ürünü sil
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await cartPage.verifyCartItemCount(3);
    await cartPage.removeProductByName(cheapestOfTopThree);
    await cartPage.verifyCartItemCount(2);

    // 4. Inventory'ye dön ve ürünü tekrar ekle
    await cartPage.continueShopping();
    await inventoryPage.addProductToCartByName(cheapestOfTopThree);
    await inventoryPage.verifyCartBadgeCount('3');

    // 5. Sepete git ve checkout sürecini başlat
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await cartPage.verifyCartItemCount(3);
    await cartPage.proceedToCheckout();

    // 6. Müşteri bilgilerini doldur
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await checkoutPage.fillInformation(
      users.customerInfo.firstName,
      users.customerInfo.lastName,
      users.customerInfo.postalCode
    );

    // 7. Siparişi tamamla ve başarı mesajını doğrula
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await checkoutPage.finishOrder();
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await checkoutPage.verifySuccessMessage('Thank you for your order!');
  });

});
