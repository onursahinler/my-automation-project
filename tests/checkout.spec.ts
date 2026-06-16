import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../data/users.json';

test.describe('Sauce Demo - Uçtan Uca Alışveriş Akışı', () => {

  test('En Pahalı İki Ürünü Sepete Ekleme ve Doğrulama', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Adım: Giriş yap
    await loginPage.navigateTo();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);

    // 2. Adım: Ürünleri fiyata göre (high to low) sırala
    await inventoryPage.sortProductsByPriceHighToLow();

    // 3. Adım: En pahalı 2 ürünü sepete ekle
    await inventoryPage.addTopExpensiveProductsToCart(2);

    // 4. Adım: Sepet ikonundaki sayının '2' olduğunu doğrula
    await inventoryPage.verifyCartBadgeCount('2');

    // 5. Adım: Sepete git
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);
  });

});