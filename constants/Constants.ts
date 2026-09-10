/**
 * Constants
 * ---------
 * Testler boyunca DEĞİŞMEYEN değerler burada tutulur:
 * beklenen mesajlar, URL kalıpları, dropdown değerleri, timeout'lar...
 *
 * Neden `static readonly`?
 *  - `static`  : instance üretmeye gerek yok -> Constants.MESSAGES.ORDER_SUCCESS
 *  - `readonly`: derleme anında değiştirilmeye karşı korumalı
 *  - `as const`: TypeScript'in değeri literal tip olarak görmesini sağlar
 *                (örn. SORT_OPTIONS.PRICE_HIGH_TO_LOW tipi 'hilo', string değil)
 */
export class Constants {
  /** Uygulama içi yollar (baseURL'e göre görelidir) */
  static readonly PATHS = {
    LOGIN: '/',
  } as const;

  /** URL doğrulamalarında kullanılan kalıplar */
  static readonly URLS = {
    LOGIN: '/',
    INVENTORY: /.*inventory\.html/,
    CART: /.*cart\.html/,
    CHECKOUT_STEP_ONE: /.*checkout-step-one\.html/,
    CHECKOUT_STEP_TWO: /.*checkout-step-two\.html/,
    CHECKOUT_COMPLETE: /.*checkout-complete\.html/,
  } as const;

  /** Uygulamanın kullanıcıya gösterdiği sabit metinler */
  static readonly MESSAGES = {
    ORDER_SUCCESS: 'Thank you for your order!',
    LOCKED_OUT_USER: 'Epic sadface: Sorry, this user has been locked out.',
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    USERNAME_REQUIRED: 'Epic sadface: Username is required',
    PASSWORD_REQUIRED: 'Epic sadface: Password is required',
  } as const;

  /** Sıralama dropdown'ının HTML value'ları */
  static readonly SORT_OPTIONS = {
    NAME_A_TO_Z: 'az',
    NAME_Z_TO_A: 'za',
    PRICE_LOW_TO_HIGH: 'lohi',
    PRICE_HIGH_TO_LOW: 'hilo',
  } as const;

  /** Gerektiğinde tekil beklemeler için standart süreler (ms) */
  static readonly TIMEOUTS = {
    SHORT: 5_000,
    MEDIUM: 15_000,
    LONG: 30_000,
  } as const;
}
