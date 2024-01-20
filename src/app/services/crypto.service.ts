import { AppInjector } from '../app.module';

import { Injectable } from '@angular/core';
import { generate } from 'random-words';
import { generateRandomId } from '../utils/generation';

import {
  CRYPTO_KEY_FORMAT,
  KEY_DERIVATION_ALGORITHM,
  SYMMETRIC_ALGORITHM,
  SYMMETRIC_KEY_LENGTH,
  USER_SECURE_STORAGE_KEY,
} from 'src/app/constants/crypto/crypto';
import { generatePbkdf2Params, generateSalt } from '../utils/crypto';
import { timeout } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { Router } from '@angular/router';

import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { User } from '../types/firestore/user';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  subtleCrypto: SubtleCrypto;
  encoder: TextEncoder;
  private _surrogateKey?: string;

  /** Set these when needed because of circular dependency
    * and we don't need these all the time.
    */
  userRepository?: UserRepositoryService;
  authService?: AuthService;
  router?: Router;

  public set surrogateKey(key: string | undefined) {
    this._surrogateKey = key;
  }

  public get surrogateKey(): string | undefined {
    return this._surrogateKey;
  }

  constructor(
  ) {
    this.subtleCrypto = window.crypto.subtle;
    this.encoder = new TextEncoder();
  }

  /* Higher Level Functions */
  async getSurrogateFromKDFProvider(
    kdfProviderPlainText: string,
    base64SurrogateKey: string,
    base64Salt: string,
  ): Promise<string> {
    const [kdfKey, _] = await this.deriveKeyFromPlainText(
      kdfProviderPlainText,
      base64Salt
    );
    return this.decrypt(kdfKey, base64SurrogateKey);
  }

  async getKDFSurrogateAndSaltFromSurrogateKey(
    kdfProviderPlaintext: string,
    base64SurrogateKey: string,
  ): Promise<{surrogateKey: string, salt: string}> {
    const [kdfKey, base64Salt] = await this.deriveKeyFromPlainText(
      kdfProviderPlaintext
    );
    const surrogateKey = await this.encrypt(kdfKey, base64SurrogateKey);
    return {
      surrogateKey,
      salt: base64Salt,
    };
  }

  generateBackupPhrase(): string {
    const words: string[] = generate({
      exactly: 3,
      minLength: 5,
      maxLength: 5,
      seed: generateRandomId()
    });
    return words.join('-');
  }

  async encryptObject(obj: any): Promise<string> {
    const objString: string = await this.encodeStringToBase64(JSON.stringify(obj));

    if (!this.surrogateKey)
      await this.tryRecoverNoSurrogateKey();
    if (!this.surrogateKey) {
      this.panic();
      throw new Error('Surrogate key not found');
    }
    return this.encrypt(this.surrogateKey, objString);
  }

  async decryptObject(encryptedObj: string): Promise<any> {
    if (!this.surrogateKey)
      await this.tryRecoverNoSurrogateKey();
    if (!this.surrogateKey) {
      this.panic();
      throw new Error('Surrogate key not found');
    }
    const decryptedObjString: string = await this.decrypt(this.surrogateKey, encryptedObj);
    return JSON.parse(await this.decodeStringFromBase64(decryptedObjString));
  }

  async trySetSurrogateKey(user: User | undefined): Promise<void> {
    if (!user || !user.encryption_data || this._surrogateKey)
      return;
    try {
      const valueObj = await SecureStoragePlugin.get({ key: USER_SECURE_STORAGE_KEY });
      if (valueObj.value) {
        const surrogateKeyPassword =
          await this.getSurrogateFromKDFProvider(
            valueObj.value,
            user.encryption_data.surrogate_key_hashed_password,
            user.encryption_data.hashed_password_salt
        );
        this.surrogateKey = surrogateKeyPassword;
      } else {
        console.log('No surrogate key found in secure storage');
      }
    } catch (error: any) {
      /** This can happen on login when no password hash is in keychain.
        * In that case, login is responsible for setting the surrogate key
        * and password hash.
        */
    }
  }

  /* Low level crypto functions */

  /** Generate a key from a plain text source (like a password) to use for encryption */
  async deriveKeyFromPlainText(text: string, base64Salt: string | undefined = undefined): Promise<[CryptoKey, string]> {
    const textB64: string = await this.encodeStringToBase64(text);
    const textBuffer: ArrayBuffer = await this.decodeFromBase64(textB64);

    const cryptoKey: CryptoKey = await this.subtleCrypto.importKey(
      CRYPTO_KEY_FORMAT,
      textBuffer,
      KEY_DERIVATION_ALGORITHM,
      false,
      ['deriveKey']
    );
    let salt: Uint8Array;
    if (!base64Salt) {
      salt = generateSalt(16);
    } else {
      const arr = await this.decodeFromBase64(base64Salt);
      salt = new Uint8Array(arr);
    }
    const derivedKey = this.subtleCrypto.deriveKey(
      generatePbkdf2Params(salt),
      cryptoKey,
      {
        name: SYMMETRIC_ALGORITHM,
        length: SYMMETRIC_KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
    return [await derivedKey, await this.encodeToBase64(salt)];
  }

  /** Generate a key to use for encryption. */
  async generateKey(): Promise<CryptoKey> {
    return this.subtleCrypto.generateKey(
      {
        name: SYMMETRIC_ALGORITHM,
        length: SYMMETRIC_KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /** Hashes a string using SHA-512
    * @param plaintext The string to hash
    * @returns A base64 encoded string of the hash
    */
  async digest(plaintext: string): Promise<string> {
    const textB64: string = await this.encodeStringToBase64(plaintext);
    const textBuffer: ArrayBuffer = await this.decodeFromBase64(textB64);
    const digestBuffer: ArrayBuffer = await this.subtleCrypto.digest(
      'SHA-512',
      textBuffer
    );
    return this.encodeToBase64(digestBuffer);
  }

  async encrypt(key: string | CryptoKey, data: string): Promise<string> {
    if (typeof key === 'string') {
      key = await this.importKeyFromString(key);
    }
    const dataBuffer: ArrayBuffer = await this.decodeFromBase64(data);

    const res: ArrayBuffer = await this.subtleCrypto.encrypt(
      {
        name: SYMMETRIC_ALGORITHM,
        iv: new Uint8Array(12),
      },
      key,
      dataBuffer
    );
    return this.encodeToBase64(res);
  }

  async decrypt(key: string | CryptoKey, data: string): Promise<string> {
    if (typeof key === 'string') {
      key = await this.importKeyFromString(key);
    }
    const dataBuffer: ArrayBuffer = await this.decodeFromBase64(data);

    const res: ArrayBuffer = await this.subtleCrypto.decrypt(
      {
        name: SYMMETRIC_ALGORITHM,
        iv: new Uint8Array(12),
      },
      key,
      dataBuffer
    );
    return this.encodeToBase64(res);
  }

  async importKeyFromString(key: string): Promise<CryptoKey> {
    const keyBuffer: ArrayBuffer = await this.decodeFromBase64(key);
    return this.subtleCrypto.importKey(
      CRYPTO_KEY_FORMAT,
      keyBuffer,
      SYMMETRIC_ALGORITHM,
      true,
      ['encrypt', 'decrypt']
    );
  }

  /** Exports a CryptoKey object as a string for storage. */
  async exportKeyToString(key: CryptoKey): Promise<string> {
    const keyBuffer: ArrayBuffer = await this.subtleCrypto.exportKey(CRYPTO_KEY_FORMAT, key);
    return this.encodeToBase64(keyBuffer);
  }

  async encodeToBase64(data: ArrayBuffer): Promise<string> {
    return btoa(
      String.fromCharCode(...new Uint8Array(data))
    );
  }

  async encodeStringToBase64(data: string): Promise<string> {
    return btoa(data);
  }

  async decodeFromBase64(data: string): Promise<ArrayBuffer> {
    return Uint8Array.from(
      atob(data),
      c => c.charCodeAt(0)
    ).buffer;
  }

  async decodeStringFromBase64(data: string): Promise<string> {
    return atob(data);
  }

  /** If for some reason the surrogate key is not set, this
    * function will attempt to recover it from the user's
    * doc manually. The user repository should automatically
    * set the surrogate key on login, so this should be a
    * last resort.
    */
  private async tryRecoverNoSurrogateKey(): Promise<void> {
    if (!this.userRepository) {
      this.userRepository = AppInjector.get(UserRepositoryService);
    }
    /* Case where user is logged in, it's just maybe not set */
    await this.userRepository.getCurrentFirestoreUser();
    /* If repo sets this, then we're good to go */
    if (this.surrogateKey) return;

    /* Wait for the user observable to emit a value, if takes
      * longer than 5 seconds, then we assume the user is not
      * logged in or something and we give up.
      */
    const userObservable = this.userRepository.currentFirestoreUser.pipe(
      timeout(5000),
    ).subscribe({
      next: async (_) => {},
      error: (_) => {},
      complete: () => {
        userObservable.unsubscribe();
      }
    });
    /* Wait for timeout or for user to be set */
    while (!userObservable.closed) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    if (this.surrogateKey) return;
    /* One last check */
    await this.userRepository.getCurrentFirestoreUser();
    if (this.surrogateKey) return;
    this.panic();
  }

  private async panic(): Promise<void> {
    this.surrogateKey = undefined;
    if (!this.authService) {
      this.authService = AppInjector.get(AuthService);
    }
    console.log('PANIC');
    await this.authService.logout("Something went wrong. Please log in again.");
    if (!this.router) {
      this.router = AppInjector.get(Router);
    }
    this.router.navigate(['/login']);
  }
}
