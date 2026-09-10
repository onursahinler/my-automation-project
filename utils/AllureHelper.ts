import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';

export { Severity };

export interface TestMetadata {
  /** En üst gruplama — ürün/proje adı */
  epic?: string;
  /** Modül/özellik — örn. "Login", "Checkout" */
  feature?: string;
  /** Senaryo — örn. "Kilitli kullanıcı girişi" */
  story?: string;
  /** Kritiklik — blocker | critical | normal | minor | trivial */
  severity?: Severity;
  /** Testin sahibi */
  owner?: string;
}

/**
 * AllureHelper
 * ------------
 * Allure'a gönderilen meta verileri (etiket, adım, ek dosya) tek noktadan yönetir.
 * Testler doğrudan allure-js-commons'a bağlanmaz; raporlama aracı değişirse
 * yalnızca bu dosya güncellenir.
 */
export class AllureHelper {
  /** Testin raporda nasıl gruplanacağını ve kritikliğini belirler */
  static async meta(data: TestMetadata) {
    if (data.epic) await allure.epic(data.epic);
    if (data.feature) await allure.feature(data.feature);
    if (data.story) await allure.story(data.story);
    if (data.severity) await allure.severity(data.severity);
    if (data.owner) await allure.owner(data.owner);
  }

  /** Raporda katlanabilir bir adım oluşturur */
  static async step<T>(name: string, body: () => Promise<T>): Promise<T> {
    return allure.step(name, body);
  }

  /** JSON verisini rapora ek dosya olarak iliştirir (örn. üretilen rastgele veri) */
  static async attachJson(name: string, data: unknown) {
    await allure.attachment(name, JSON.stringify(data, null, 2), 'application/json');
  }

  /** Düz metin eki */
  static async attachText(name: string, text: string) {
    await allure.attachment(name, text, 'text/plain');
  }

  /** Test yönetim aracı / hata kaydı bağlantısı */
  static async issue(name: string, url: string) {
    await allure.issue(name, url);
  }
}
