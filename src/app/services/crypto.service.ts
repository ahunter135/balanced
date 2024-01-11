import { Injectable } from '@angular/core';
import { generate, count } from 'random-words';
import { generateRandomId } from '../utils/generation';

import {
  CRYPTO_KEY_FORMAT,
  KEY_DERIVATION_ALGORITHM,
  SYMMETRIC_ALGORITHM,
  SYMMETRIC_KEY_LENGTH,
} from 'src/app/constants/crypto/crypto';
import { generatePbkdf2Params, generateSalt } from '../utils/crypto';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  subtleCrypto: SubtleCrypto;
  encoder: TextEncoder;
  private _surrogateKey?: string;

  public set surrogateKey(key: string | undefined) {
    this._surrogateKey = key;
  }

  public get surrogateKey(): string | undefined {
    return this._surrogateKey;
  }

  constructor() {
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

}
