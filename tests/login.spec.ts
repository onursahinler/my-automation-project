import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../data/users.json';

test.describe('Sauce Demo - Login Test Süiti', () => {
  
  // Her testten önce temiz bir sayfa ile LoginPage instance'ı oluşturuyoruz
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateTo();
  });

  test('Başarılı Kullanıcı Girişi ve Doğrulama', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // validUser için olan veriyi JSON dosyamızdan çekiyoruz
    await loginPage.login(users.validUser.username, users.validUser.password);

    // Giriş yaptıktan sonra URL'in /inventory.html içerdiğini doğruluyoruz
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Kilitli Kullanıcı Giriş Hatası Doğrulaması', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Kilitli kullanıcıyı deniyoruz
    await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);

    // Sayfa üzerinde çıkan spesifik hata mesajını POM fonksiyonumuzla doğruluyoruz
    await loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Geçersiz Kullanıcı Giriş Hatası Doğrulaması', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Yanlış şifre kombinasyonunu deniyoruz
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);

    // Hata mesajını doğruluyoruz
    await loginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service');
  });

});