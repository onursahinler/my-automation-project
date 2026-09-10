import { test, expect } from '../hooks/hook';
import { Constants } from '../constants/Constants';
import { AllureHelper, Severity } from '../utils/AllureHelper';

/* beforeEach yok: `loggedInApp` fixture'ı her testten önce
   login olup inventory sayfasına geçmiş bir uygulama verir. */
test.describe('Sidebar & Header Navigation Tests', () => {

  test('TC01: Sepet sayfasından All Items butonuyla envantere geri dönebilmeli', { tag: '@regression' }, async ({ loggedInApp, page }) => {
    await AllureHelper.meta({ epic: 'Sauce Demo E-Ticaret', feature: 'Navigasyon', story: 'All Items ile envantere dönüş', severity: Severity.NORMAL });
    // 1. Sepete git
    await loggedInApp.commonPage.goToCart();
    await expect(page).toHaveURL(Constants.URLS.CART);

    // 2. Yan menüyü açıp "All Items" linkine tıkla
    await loggedInApp.commonPage.navigateToAllItems();

    // 3. Tekrar inventory sayfasına döndüğünü ve ürünlerin listelendiğini doğrula
    await expect(page).toHaveURL(Constants.URLS.INVENTORY);
    await loggedInApp.inventoryPage.verifyPageLoaded();
  });

  test('TC02: Yan menü açılıp "X" butonu ile kapatılabilmeli', { tag: '@regression' }, async ({ loggedInApp }) => {
    await AllureHelper.meta({ epic: 'Sauce Demo E-Ticaret', feature: 'Navigasyon', story: 'Yan menü aç/kapat', severity: Severity.MINOR });
    // 1. Menüyü aç
    await loggedInApp.commonPage.openMenu();
    await expect(loggedInApp.commonPage.allItemsLink).toBeVisible();

    // 2. Menüyü kapat
    await loggedInApp.commonPage.closeMenu();
    await expect(loggedInApp.commonPage.allItemsLink).not.toBeVisible();
  });

  test('TC03: Logout fonksiyonu oturumu sonlandırıp login ekranına yönlendirmeli', { tag: ['@smoke', '@regression'] }, async ({ loggedInApp, page }) => {
    await AllureHelper.meta({ epic: 'Sauce Demo E-Ticaret', feature: 'Navigasyon', story: 'Oturum kapatma', severity: Severity.CRITICAL });
    // 1. CommonPage üzerinden çıkış yap
    await loggedInApp.commonPage.logout();

    // 2. Login URL'ine dönüldüğünü ve giriş butonunun görünür olduğunu doğrula
    await expect(page).toHaveURL(Constants.URLS.LOGIN);
    await loggedInApp.loginPage.verifyPageLoaded();
  });

});
