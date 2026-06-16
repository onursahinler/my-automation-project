# E-Commerce End-to-End Automation Framework (Playwright & TypeScript)

Bu proje, **Sauce Demo** e-ticaret platformunun kullanıcı senaryolarını test etmek amacıyla sektör standartlarında geliştirilmiş, sürdürülebilir ve ölçeklenebilir bir **Web Otomasyon Framework** çalışmasıdır.

---

## Öne Çıkan Teknik Konseptler & Mimari

* **Page Object Model (POM):** Kodun bakımını kolaylaştırmak, tekrarını önlemek (Reusability) ve element locator'ları ile test adımlarını birbirinden ayırmak için POM mimarisi uygulandı.
* **Data-Driven Testing (DDT):** Test verileri (kullanıcı bilgileri, müşteri adres verileri vb.) kod içerisine gömülmek yerine, dış kaynaklı bir `users.json` dosyasından dinamik olarak beslenecek şekilde kurgulandı.
* **Smart Wait & Auto-Wait:** Playwright'ın gömülü gelen akıllı bekleme mekanizması kullanılarak, kırılgan (flaky) testlerin önüne geçildi ve `sleep` gibi hantal yapılardan kaçınıldı.
* **Çoklu Senaryo Desteği:** Başarılı uçtan uca (E2E) satın alma akışının yanı sıra, kilitli kullanıcı ve geçersiz kimlik bilgileri gibi negatif test senaryoları da kapsandı.

---

## Kullanılan Teknolojiler

* **Test Runner & Automation:** [Playwright](https://playwright.dev/)
* **Programlama Dili:** TypeScript
* **Geliştirme Ortamı:** Node.js, Cursor (VS Code Tabanlı)
* **Sürüm Kontrolü:** Git & GitHub

---

## Klasör Yapısı

```text
playwright-ecommerce-automation/
├── data/               # Test verilerini barındıran JSON dosyaları
│   └── users.json
├── pages/              # POM Mimarisindeki Sayfa Nesneleri (Sınıflar ve Aksiyonlar)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/              # Gerçek test senaryolarının koşulduğu spec dosyaları
│   ├── login.spec.ts
│   └── checkout.spec.ts
├── playwright.config.ts # Playwright global konfigürasyon ayarları
└── package.json        # Proje bağımlılıkları ve script tanımları 
```

## Kurulum ve Test Koşumu

Projeyi yerelde çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Gereksinimler
Bilgisayarınızda **Node.js** yüklü olmalıdır.

### 2. Projeyi Klonlayın ve Bağımlılıkları Kurun
* git clone <https://github.com/onursahinler/my-automation-project.git>
* cd playwright-ecommerce-automation
* npm install

### 3. Testleri Çalıştırın

* **Arka Planda (Headless) Koşum:**
npx playwright test

* **Arayüzlü (Headed) Koşum:**
npx playwright test --headed

* **İnteraktif UI Mode ile (Time-Travel) Koşumu:**
npx playwright test --ui

* **Test Raporunu Görüntüleme:**
npx playwright show-report
