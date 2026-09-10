# E-Commerce End-to-End Automation Framework (Playwright & TypeScript)

Bu proje, **Sauce Demo** e-ticaret platformunun kullanıcı senaryolarını test etmek amacıyla geliştirilmiş, sürdürülebilir ve ölçeklenebilir bir **Web Otomasyon Framework**'üdür.

Framework; Page Object Model üzerine kurulu, ortak davranışların `BasePage` ile miras alındığı, hook'ların Playwright fixture'larında merkezîleştirildiği, sabit ile ortama bağlı değerlerin birbirinden ayrıldığı bir mimariye sahiptir.

---

## Öne Çıkan Teknik Konseptler & Mimari

* **Page Object Model (POM):** Element locator'ları ile test adımları birbirinden ayrıldı. Spec dosyalarında tek bir ham `page.locator()` çağrısı bulunmaz.
* **BasePage & Kalıtım:** Tüm sayfa sınıflarının ortak davranışı (`page` yönetimi, navigasyon, etkileşim ve assertion sarmalayıcıları) `BasePage` içinde toplandı; alt sınıflar yalnızca kendi locator'larını ve iş kurallarını tanımlar.
* **Merkezî Hook Yönetimi:** `test.beforeEach` blokları spec dosyalarından kaldırılıp `hooks/hook.ts` içindeki `Hooks` sınıfına ve Playwright fixture'larına (`app`, `loggedInApp`) taşındı.
* **Constants & Environment Ayrımı:** Değişmeyen değerler (beklenen mesajlar, URL kalıpları, dropdown value'ları) `constants/Constants.ts`'te; ortama göre değişen değerler (`BASE_URL`, parola, `HEADLESS`, `SLOW_MO`) `.env` dosyasında tutulur.
* **Data-Driven Testing (DDT):** Kullanıcı adları `users.json`'dan, parolalar `.env`'den, checkout formu verileri ise **Faker** ile rastgele üretilerek beslenir. Kaynak kodda parola veya sabit test verisi yer almaz.
* **Test Etiketleme:** Testler `@smoke` ve `@regression` etiketleriyle sınıflandırıldı; kritik yol ayrı, tam kapsam ayrı koşturulabilir.
* **Smart Wait & Auto-Wait:** Playwright'ın gömülü akıllı bekleme mekanizması kullanıldı; `sleep` / sabit bekleme yoktur.
* **Çoklu Senaryo Desteği:** Uçtan uca satın alma akışının yanı sıra kilitli kullanıcı, geçersiz kimlik bilgisi ve yavaş ağ (performance glitch) senaryoları kapsandı.

---

## Kullanılan Teknolojiler

| Alan | Teknoloji |
|---|---|
| Test Runner & Automation | [Playwright](https://playwright.dev/) |
| Programlama Dili | TypeScript |
| Test Verisi Üretimi | [@faker-js/faker](https://fakerjs.dev/) (locale: `fakerTR`) |
| Ortam Yönetimi | `.env` + Node yerleşik `process.loadEnvFile()` (ek bağımlılık yok) |
| CI/CD | GitHub Actions |
| Sürüm Kontrolü | Git & GitHub |

---

## Klasör Yapısı

```text
my-automation-project/
├── config/
│   └── env.ts              # .env okuyucu — ortama bağlı tüm parametreler
├── constants/
│   └── Constants.ts        # Değişmeyen değerler: mesajlar, URL'ler, sort option'ları
├── data/
│   ├── users.json          # Kullanıcı adları (parola içermez)
│   └── users.ts            # users.json + .env parolasını birleştirir
├── hooks/
│   └── hook.ts             # Hooks sınıfı + `app` / `loggedInApp` fixture'ları
├── pages/                  # Page Object Model
│   ├── BasePage.ts         # Ortak davranışlar (tüm sayfaların atası)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── CommonPage.ts       # Header + yan menü bileşeni
├── utils/
│   └── DataFactory.ts      # Faker ile rastgele test verisi üretimi
├── tests/                  # Spec dosyaları (@smoke / @regression etiketli)
│   ├── login.spec.ts
│   ├── checkout.spec.ts
│   ├── cart-checkout-flow.spec.ts
│   ├── performance-glitch-user.spec.ts
│   └── sidebar.spec.ts
├── .github/workflows/
│   └── playwright.yml      # CI pipeline
├── .env                    # Gizli/ortama bağlı değerler (git'e gönderilmez)
├── .env.example            # .env şablonu (git'e gönderilir)
├── playwright.config.ts    # Global konfigürasyon (tamamı ENV'den beslenir)
└── package.json            # Bağımlılıklar ve npm script'leri
```

---

## Katmanların Sorumlulukları

| Katman | Sorumluluk | Örnek |
|---|---|---|
| `tests/` | **Ne** test edileceği — senaryo adımları ve iş doğrulamaları | `await app.cartPage.proceedToCheckout()` |
| `hooks/` | Testlerin ortak hazırlığı (fixture = beforeEach/afterEach) | `loggedInApp` fixture'ı |
| `pages/` | **Nasıl** etkileşileceği — locator'lar ve sayfa aksiyonları | `LoginPage.login()` |
| `pages/BasePage.ts` | Tüm sayfalarda tekrar eden teknik davranış | `expectText()`, `click()`, `goto()` |
| `constants/` | Değişmeyen değerler | `MESSAGES.ORDER_SUCCESS` |
| `config/` + `.env` | Ortama göre değişen değerler | `BASE_URL`, `HEADLESS` |
| `data/` | Test verisi (kimlik bilgileri) | `users.standardUser` |
| `utils/` | Rastgele test verisi üretimi | `DataFactory.customerInfo()` |

### Fixture kullanımı

Spec dosyalarında `test.beforeEach` yazılmaz; ihtiyaca göre iki fixture'dan biri seçilir:

```ts
// Login ekranında başlar (giriş yapılmamış)
test('...', async ({ app }) => {
  await app.loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
});

// Standart kullanıcıyla giriş yapılmış, inventory sayfasında başlar
test('...', async ({ loggedInApp }) => {
  await loggedInApp.inventoryPage.sortProductsByPriceHighToLow();
});
```

---

## Test Senaryoları

| Spec | Senaryo | Etiket |
|---|---|---|
| `login.spec.ts` | Başarılı kullanıcı girişi | `@smoke` `@regression` |
| `login.spec.ts` | Kilitli kullanıcı hata mesajı | `@regression` |
| `login.spec.ts` | Geçersiz kimlik bilgisi hata mesajı | `@regression` |
| `checkout.spec.ts` | En pahalı 2 ürünü satın alma (E2E) | `@smoke` `@regression` |
| `cart-checkout-flow.spec.ts` | 3 ürün ekle → en ucuzunu sil → tekrar ekle → satın al | `@regression` |
| `performance-glitch-user.spec.ts` | Yavaş ağ koşullarında satın alma | `@regression` |
| `sidebar.spec.ts` | All Items ile envantere dönüş | `@regression` |
| `sidebar.spec.ts` | Yan menüyü açma/kapatma | `@regression` |
| `sidebar.spec.ts` | Logout ile oturum sonlandırma | `@smoke` `@regression` |

---

## Ortam Değişkenleri

`.env` dosyası `.gitignore`'dadır; repoya yalnızca `.env.example` şablonu gönderilir.

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | Testlerin koşacağı ortam |
| `USER_PASSWORD` | `secret_sauce` | Geçerli kullanıcıların parolası |
| `HEADLESS` | `true` | Tarayıcı arka planda mı koşsun |
| `SLOW_MO` | `0` | Her adım arası gecikme (ms) — debug için |
| `ACTION_TIMEOUT` | `15000` | Tek bir aksiyonun süre limiti (ms) |
| `TEST_TIMEOUT` | `60000` | Tek bir testin süre limiti (ms) |
| `RETRIES` | `0` | Başarısız testin tekrar deneme sayısı (CI'da 2) |

---

## Kurulum

### 1. Projeyi klonlayın ve bağımlılıkları kurun

```bash
git clone https://github.com/onursahinler/my-automation-project.git
cd my-automation-project
npm install
```

### 2. Ortam dosyasını oluşturun

```bash
cp .env.example .env      # ardından USER_PASSWORD değerini doldurun
```

### 3. Tarayıcıları kurun

```bash
npm run install:browsers
```

---

## Test Koşumu

| Komut | Açıklama |
|---|---|
| `npm test` | Tüm testler (önce eski raporları temizler) |
| `npm run test:chromium` | Yalnızca Chromium |
| `npm run test:firefox` / `test:webkit` | Tek tarayıcı koşumu |
| `npm run test:all-browsers` | Chromium + Firefox + WebKit |
| `npm run test:headed` | Tarayıcı görünür şekilde |
| `npm run test:ui` | İnteraktif UI Mode (time-travel debugging) |
| `npm run test:debug` | Playwright Inspector ile adım adım |
| `npm run test:smoke` | Yalnızca `@smoke` etiketli kritik testler |
| `npm run test:regression` | `@regression` etiketli tam kapsam |
| `npm run test:login` | Tek bir spec dosyası |
| `npm run test:e2e` | Uçtan uca satın alma akışları |
| `npm run test:failed` | Yalnızca son koşumda fail olanlar |
| `npm run test:ci` | CI için: Chromium + html & github reporter |
| `npm run report` | HTML raporunu aç |
| `npm run trace` | Trace dosyasını görüntüle |
| `npm run codegen` | Kayıttan test kodu üret |
| `npm run clean` | Rapor ve çıktı klasörlerini temizle |

---

## CI/CD

`.github/workflows/playwright.yml`, `main` / `master` dallarına yapılan push ve pull request'lerde çalışır:

1. Bağımlılıkları kurar (`npm ci`)
2. Tarayıcıları kurar (`npm run install:browsers`)
3. Testleri koşar (`npm run test:ci`)
4. HTML raporunu artifact olarak 30 gün saklar

`.env` repoya gönderilmediği için CI değerleri workflow'un `env` bloğundan verilir; parola GitHub repo ayarlarındaki `USER_PASSWORD` secret'ından okunur.
