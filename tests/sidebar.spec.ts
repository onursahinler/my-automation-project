import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CommonPage } from '../pages/CommonPage';
import users from '../data/users.json';

test.describe('Sidebar & Header Navigation Tests', () => {
  let loginPage: LoginPage;
  let commonPage: CommonPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    commonPage = new CommonPage(page);

    // Her test öncesi login ol ve inventory sayfasına geç
    await loginPage.navigateTo();
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('TC01: Sepet sayfasından All Items butonuyla envantere geri dönebilmeli', async ({ page }) => {
    // 1. Sepete git
    await commonPage.goToCart();
    await expect(page).toHaveURL(/.*cart.html/);

    // 2. Yan menüyü açıp "All Items" linkine tıkla
    await commonPage.navigateToAllItems();

    // 3. Tekrar inventory sayfasına döndüğünü ve ürünlerin listelendiğini doğrula
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC02: Yan menü açılıp "X" butonu ile kapatılabilmeli', async () => {
    // 1. Menüyü aç
    await commonPage.openMenu();
    await expect(commonPage.allItemsLink).toBeVisible();

    // 2. Menüyü kapat
    await commonPage.closeMenu();
    await expect(commonPage.allItemsLink).not.toBeVisible();
  });

  test('TC03: Logout fonksiyonu oturumu sonlandırıp login ekranına yönlendirmeli', async ({ page }) => {
    // 1. CommonPage üzerinden çıkış yap
    await commonPage.logout();

    // 2. Login URL'ine dönüldüğünü ve giriş butonunun görünür olduğunu doğrula
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});