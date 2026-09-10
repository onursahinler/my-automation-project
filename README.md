# E-Commerce End-to-End Automation Framework (Playwright & TypeScript)

Bu proje, **Sauce Demo** e-ticaret platformunun kullanıcı senaryolarını test etmek amacıyla sektör standartlarında geliştirilmiş, sürdürülebilir ve ölçeklenebilir bir **Web Otomasyon Framework** çalışmasıdır.

---

## Öne Çıkan Teknik Konseptler & Mimari

* **Page Object Model (POM):** Kodun bakımını kolaylaştırmak, tekrarını önlemek (Reusability) ve element locator'ları ile test adımlarını birbirinden ayırmak için POM mimarisi uygulandı.
* **BasePage & Kalıtım:** Tüm sayfa sınıflarının ortak davranışları (`page` yönetimi, navigasyon, assertion sarmalayıcıları) `BasePage` içinde toplandı; alt sınıflar yalnızca kendi locator ve iş kurallarını tanımlar.
* **Merkezî Hook Yönetimi:** `test.beforeEach` blokları spec dosyalarından kaldırılıp `hooks/hook.ts` içindeki `Hooks` sınıfı ve Playwright fixture'larına (`app`, `loggedInApp`) taşındı.
* **Data-Driven Testing (DDT):** Kullanıcı adları `users.json`'dan, parolalar `.env`'den, checkout formu verileri ise **Faker** ile rastgele üretilerek beslenir.
* **Constants & Environment Ayrımı:** Değişmeyen değerler (mesajlar, URL kalıpları, dropdown value'ları) `constants/Constants.ts`'te; ortama göre değişen değerler (`BASE_URL`, parola, `HEADLESS`, `SLOW_MO`) `.env` dosyasında tutulur.
* **Smart Wait & Auto-Wait:** Playwright'ın gömülü gelen akıllı bekleme mekanizması kullanılarak, kırılgan (flaky) testlerin önüne geçildi ve `sleep` gibi hantal yapılardan kaçınıldı.
* **Çoklu Senaryo Desteği:** Başarılı uçtan uca (E2E) satın alma akışının yanı sıra, kilitli kullanıcı ve geçersiz kimlik bilgileri gibi negatif test senaryoları da kapsandı.

---

## Kullanılan Teknolojiler

* **Test Runner & Automation:** [Playwright](https://playwright.dev/)
* **Programlama Dili:** TypeScript
* **Test Verisi Üretimi:** [@faker-js/faker](https://fakerjs.dev/)
* **Geliştirme Ortamı:** Cursor (VS Code Tabanlı)
* **Sürüm Kontrolü:** Git & GitHub

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
├── .env                    # Gizli/ortama bağlı değerler (git'e gönderilmez)
├── .env.example            # .env şablonu (git'e gönderilir)
├── playwright.config.ts    # Global konfigürasyon (tamamı ENV'den beslenir)
└── package.json            # Bağımlılıklar ve npm script'leri
```

## Kurulum ve Test Koşumu

Projeyi yerelde çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Projeyi Klonlayın ve Bağımlılıkları Kurun
* git clone <https://github.com/onursahinler/my-automation-project.git>
* cd playwright-ecommerce-automation
* npm install

### 2. Ortam Dosyasını Oluşturun

```bash
cp .env.example .env      # ardından USER_PASSWORD değerini doldurun
```

### 3. Tarayıcıları Kurun

```bash
npm run install:browsers
```

### 4. Testleri Çalıştırın

| Komut | Açıklama |
|---|---|
| `npm test` | Tüm testler (önce eski raporları temizler) |
| `npm run test:chromium` | Yalnızca Chromium |
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
