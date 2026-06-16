import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../data/users.json';

test.describe('Sauce Demo - Uçtan Uca Alışveriş Akışı', () => {

  test('En Pahalı İki Ürünü Satın Alma ve Alışverişi Tamamlama', async ({ page }) => {
    // Sayfa nesnesi instance'larını oluşturuyoruz
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Adım: Giriş yap
    await loginPage.navigateTo();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);

    // 2. Adım: Ürünleri fiyata göre sırala ve en pahalı 2 tanesini sepete ekle
    await inventoryPage.sortProductsByPriceHighToLow();
    await inventoryPage.addTopExpensiveProductsToCart(2);
    await inventoryPage.verifyCartBadgeCount('2');

    // 3. Adım: Sepete git ve Checkout sürecini başlat
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
    await cartPage.proceedToCheckout();

    // 4. Adım: Müşteri bilgilerini doldur ve devam et
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await checkoutPage.fillInformation(
      users.customerInfo.firstName,
      users.customerInfo.lastName,
      users.customerInfo.postalCode
    );

    // 5. Adım: Sipariş özetini onayla ve alışverişi bitir
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await checkoutPage.finishOrder();

    // 6. Adım: Başarı mesajını doğrula (Final Assertion)
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await checkoutPage.verifySuccessMessage('Thank you for your order!');
  });

});