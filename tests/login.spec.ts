import { test, expect, users } from '../hooks/hook';

/* beforeEach yok: `app` fixture'ı (hooks/hook.ts) her testten önce
   sayfa nesnelerini kurar ve login ekranını açar. */
test.describe('Sauce Demo - Login Test Süiti', () => {

  test('Başarılı Kullanıcı Girişi ve Doğrulama', async ({ app, page }) => {
    await app.loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Kilitli Kullanıcı Giriş Hatası Doğrulaması', async ({ app }) => {
    await app.loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    await app.loginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });

  test('Geçersiz Kullanıcı Giriş Hatası Doğrulaması', async ({ app }) => {
    await app.loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await app.loginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service');
  });

});
