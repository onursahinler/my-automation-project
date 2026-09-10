import { fakerTR as faker } from '@faker-js/faker';

/**
 * DataFactory
 * -----------
 * Faker ile RASTGELE test verisi üretir.
 *
 * Neden rastgele veri?
 *  - Aynı veriyle tekrar tekrar koşan testler, uygulamanın gerçekte
 *    farklı girdilerle çalışıp çalışmadığını göstermez.
 *  - Sabit veri, "unique" alanlarda (e-posta, sipariş no) çakışma yaratır.
 *  - Hardcoded "Ahmet Yılmaz" gibi veriler zamanla test verisi kirliliği yaratır.
 *
 * DİKKAT: Rastgele veri sadece DEĞERİ ÖNEMSİZ alanlar için kullanılır.
 * Kullanıcı adı/parola gibi doğrulanan veriler .env + users.json'da kalır,
 * beklenen mesajlar Constants'ta kalır — onlar rastgele olamaz.
 *
 * `fakerTR`: Türkçe locale — Türkçe isim/adres üretir.
 */

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class DataFactory {
  /** Checkout formu için rastgele müşteri bilgisi */
  static customerInfo(): CustomerInfo {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      postalCode: faker.location.zipCode('#####'),
    };
  }

  /** Rastgele adres bilgisi (ihtiyaç duyulursa) */
  static address() {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postalCode: faker.location.zipCode('#####'),
      country: faker.location.country(),
    };
  }

  /** Rastgele ama geçersiz kimlik bilgisi — negatif login testleri için */
  static invalidCredentials() {
    return {
      username: faker.internet.username().toLowerCase(),
      password: faker.internet.password({ length: 12 }),
    };
  }

  /** Benzersiz e-posta (aynı anda koşan testlerin çakışmaması için) */
  static email(): string {
    return faker.internet.email({ provider: 'test.local' }).toLowerCase();
  }

  /** Belirtilen uzunlukta rastgele metin — sınır değer (boundary) testleri için */
  static randomString(length: number = 10): string {
    return faker.string.alpha({ length });
  }

  /** Belirtilen aralıkta rastgele tam sayı */
  static randomNumber(min: number = 1, max: number = 100): number {
    return faker.number.int({ min, max });
  }

  /** Rastgele telefon numarası */
  static phoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Tekrarlanabilirlik (reproducibility):
   * Bir test rastgele veri yüzünden fail ettiğinde aynı veriyle tekrar
   * koşturabilmek için tohum (seed) sabitlenebilir.
   *   DataFactory.seed(12345);
   */
  static seed(value: number) {
    faker.seed(value);
  }
}
