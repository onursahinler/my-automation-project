import { ENV } from '../config/env';
import rawUsers from './users.json';

export interface Credentials {
  username: string;
  password: string;
}

/**
 * Kullanıcı ADLARI users.json'da (test verisi),
 * PAROLA ise .env dosyasında (gizli/ortama bağlı) tutulur.
 * Bu fonksiyon ikisini birleştirir.
 */
const withEnvPassword = (username: string): Credentials => ({
  username,
  password: ENV.USER_PASSWORD,
});

export const users = {
  standardUser: withEnvPassword(rawUsers.standardUser.username),
  lockedOutUser: withEnvPassword(rawUsers.lockedOutUser.username),
  problemUser: withEnvPassword(rawUsers.problemUser.username),
  performanceGlitchUser: withEnvPassword(rawUsers.performanceGlitchUser.username),
  errorUser: withEnvPassword(rawUsers.errorUser.username),

  /** Kasıtlı olarak hatalı — negatif test verisi, gerçek bir kimlik bilgisi değil */
  invalidUser: rawUsers.invalidUser as Credentials,
};
