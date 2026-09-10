import { test, expect, users } from '../hooks/hook';
import { Constants } from '../constants/Constants';

/* beforeEach yok: `app` fixture'ı (hooks/hook.ts) her testten önce
   sayfa nesnelerini kurar ve login ekranını açar. */
test.describe('Sauce Demo - Login Test Süiti', () => {

  test('Başarılı Kullanıcı Girişi ve Doğrulama', async ({ app, page }) => {
    await app.loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(Constants.URLS.INVENTORY);
  });

  test('Kilitli Kullanıcı Giriş Hatası Doğrulaması', async ({ app }) => {
    await app.loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
    await app.loginPage.verifyErrorMessage(Constants.MESSAGES.LOCKED_OUT_USER);
  });

  test('Geçersiz Kullanıcı Giriş Hatası Doğrulaması', async ({ app }) => {
    await app.loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await app.loginPage.verifyErrorMessage(Constants.MESSAGES.INVALID_CREDENTIALS);
  });

});
