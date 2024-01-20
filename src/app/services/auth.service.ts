import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  User as AuthUser,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { Category, User as FirestoreUser } from '../types/firestore/user';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { CreateAccountOthers } from '../types/firestore/auth';
import { getDefaultCategories } from '../helpers/firestore/auth-helpers';
import { CategoryRepositoryService } from '../repositories/category-repository.service';
import { Observable } from 'rxjs';
import { CryptoService } from './crypto.service';
import { AlertService } from './alert.service';
import { FieldValue, deleteField } from 'firebase/firestore';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { USER_SECURE_STORAGE_KEY } from '../constants/crypto/crypto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userToken: string = '';
  private _currentUserIdCached: string | null;
  get currentUserId(): string | null {
    return this._currentUserIdCached;
  }

  public currentAuthUser: Observable<AuthUser | null> = new Observable(
    (observer) => {
      onAuthStateChanged(this.auth, (user: AuthUser | null) => {
        if (user) {
          this._currentUserIdCached = user.uid;
        } else {
          this._currentUserIdCached = null;
          /* Clear the cached user when the user logs out */
          this.userRepository.onUserLoggedOut();
        }
        observer.next(user);
      });
    }
  );

  constructor(
    private auth: Auth,
    private userRepository: UserRepositoryService,
    private categoryRepository: CategoryRepositoryService,
    private cryptoService: CryptoService,
    private alertService: AlertService,
  ) {}

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      const user = await this.userRepository.getCurrentFirestoreUser();
      if (!user || !user.encryption_data)
        throw new Error('Something went wrong');

      if (!user.encryption_data.surrogate_key_hashed_password) {
        await this.loginGetSurrogateFromPasswordDeprecated(user, password);
      } else {
        await this.loginGetSurrogateFromPassword(user, password);
      }
    } catch (error: any) {
      console.error(error);
      throw new Error('Email or password is incorrect');
    }
  }

  /** Used for existing accounts that have not been migrated to the new
    * encryption scheme. This will be removed once all accounts have
    * been migrated.
    * @deprecated
    */
  async loginGetSurrogateFromPasswordDeprecated(user: FirestoreUser, password: string): Promise<void> {
    const surrogateKeyPassword =
      await this.cryptoService.getSurrogateFromKDFProvider(
        password,
        user.encryption_data!.surrogate_key_password, // we know this exists from caller
        user.encryption_data!.password_kdf_salt
    );
    this.cryptoService.surrogateKey = surrogateKeyPassword;
    console.log("Got surrogate key from password", surrogateKeyPassword);
    /* Migration code */
    let passwordHash: string;
    while (true) {
      passwordHash = await this.cryptoService.digest(password);
      const [passwordHashKDFKey, base64Salt] =
        await this.cryptoService.deriveKeyFromPlainText(passwordHash);

      const base64PasswordHashKDFKey: string =
        await this.cryptoService.exportKeyToString(passwordHashKDFKey);
      const newSurrogateKeyPasswordHash: string = await this.cryptoService.encrypt(
        base64PasswordHashKDFKey,
        surrogateKeyPassword
      );

      await this.userRepository.update(user.id!, {
        encryption_data: {
          surrogate_key_hashed_password: newSurrogateKeyPasswordHash,
          hashed_password_salt: base64Salt,
        },
      });
      console.log("Updated surrogate key hash and salt");

      const freshUser = await this.userRepository.getCurrentFirestoreUser();
      console.log("Got new user", freshUser);
      if (!freshUser || !freshUser.encryption_data)
        throw new Error('Something went wrong');
      if (!freshUser.encryption_data.surrogate_key_hashed_password ||
          !freshUser.encryption_data.hashed_password_salt) {
        console.log("New data not set, retrying");
      } else {
        console.log("New data set, breaking");
        break;
      }
    }
    console.log("Deleting old fields");
    /* Delete old fields */
    await this.userRepository.update(user.id!, {
      encryption_data: {
        surrogate_key_password: '',
        password_kdf_salt: '',
        surrogate_key_refresh_token: '',
        refresh_token_kdf_salt: '',
      },
    });
    console.log("Deleted old fields");
    /* Save password has to secure storage */
    const success = await this.secureStore(USER_SECURE_STORAGE_KEY, passwordHash);
    if (success.value) {
      console.log("Saved password hash to secure storage");
    }

    return;
  }

  async loginGetSurrogateFromPassword(
    user: FirestoreUser,
    password: string
  ): Promise<void> {
    const passwordHash = await this.cryptoService.digest(password);
    const surrogateKeyPassword =
      await this.cryptoService.getSurrogateFromKDFProvider(
        passwordHash,
        user.encryption_data!.surrogate_key_hashed_password, // we know this exists from caller
        user.encryption_data!.hashed_password_salt
    );
    this.cryptoService.surrogateKey = surrogateKeyPassword;
    /* Check if the password hash is in secure storage */
    try {
      /* This throws an error if the password hash is not in secure storage */
      const passwordHashSecure = await this.secureGet(USER_SECURE_STORAGE_KEY);
    } catch (error) {
      await this.secureStore(USER_SECURE_STORAGE_KEY, passwordHash);
      console.log("Saved password hash to secure storage");
    }
  }

  async createAccount(
    email: string,
    password: string,
    other: CreateAccountOthers
  ): Promise<FirestoreUser> {
    /* Create user in auth and firestore */
    let newFirestoreUser: FirestoreUser = await this.createUserStuff(
      email,
      password,
      other
    );

    /* Set up encryption keys */
    const { base64SurrogateKey, base64PasswordHashKDFKey, base64PasswordKDFSalt } =
      await this.createUserSurrogateKeyAndPasswordKDFKey(password);

    /* Encrypt the surrogate key with the password KDF key */
    const surrogateKeyPasswordHash: string = await this.cryptoService.encrypt(
      base64PasswordHashKDFKey,
      base64SurrogateKey
    );

    /* Save the surrogate key to the crypto service */
    this.cryptoService.surrogateKey = base64SurrogateKey;

    /* Save to database */
    await this.userRepository.update(newFirestoreUser.id!, {
      encryption_data: {
        surrogate_key_hashed_password: surrogateKeyPasswordHash,
        hashed_password_salt: base64PasswordKDFSalt,
      },
    });
    return newFirestoreUser;
  }

  /** This is not going to be used anymore, once all accounts have
    * been migrated to the new encryption scheme, delete this
    * function.
    * @deprecated
    */
  async setRefreshTokenSurrogateKey(base64SurrogateKey: string): Promise<void> {
    const refreshToken = this.getRefreshToken();
    const { surrogateKey, salt } =
      await this.cryptoService.getKDFSurrogateAndSaltFromSurrogateKey(
        refreshToken,
        base64SurrogateKey
      );
    if (!this.auth.currentUser) throw new Error('No user logged in');
    await this.userRepository.update(this.auth.currentUser.uid, {
      encryption_data: {
        surrogate_key_refresh_token: surrogateKey,
        refresh_token_kdf_salt: salt,
      },
    });
  }

  async logout(message: string | undefined = undefined): Promise<Boolean> {
    try {
      await this.auth.signOut();
      this.secureRemove(USER_SECURE_STORAGE_KEY);
      this._currentUserIdCached = null;
      if (message) {
        this.alertService.createAndShowToast(message);
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getCurrentAuthUser(): Promise<AuthUser | null> {
    return this.auth.currentUser;
  }

  async deleteAuthUser(): Promise<void> {
    const user = await this.getCurrentAuthUser();
    if (user) {
      await user.delete();
      this._currentUserIdCached = null;
    }
  }

  private async secureStore(key: string, value: string): Promise<{ value: boolean }> {
    return SecureStoragePlugin.set({
      key,
      value,
    });
  }

  private async secureGet(key: string): Promise<{ value: string}> {
    return SecureStoragePlugin.get({
      key,
    });
  }

  private async secureRemove(key: string): Promise<{ value: boolean }> {
    return SecureStoragePlugin.remove({
      key,
    });
  }

  private getRefreshToken(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No user logged in');
    return user.refreshToken;
  }

  private async createUserStuff(
    email: string,
    password: string,
    other: CreateAccountOthers
  ): Promise<FirestoreUser> {
    /* Create auth user */
    let userSignUp: UserCredential;
    try {
      userSignUp = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
    } catch (error) {
      throw new Error('Something went wrong');
    }

    let newUser: FirestoreUser = {
      email,
      id: userSignUp.user.uid,
      subscribed: false,
      name: other.name,
      token: this.userToken,
    };

    let tmp: FirestoreUser | undefined;
    try {
      tmp = await this.userRepository.add(newUser, newUser.id);

      const defaultCategories: Category[] = getDefaultCategories();
      let categoryAddPromises: Promise<Category | undefined>[] = [];

      // Add categories to the user's doc
      for (let category of defaultCategories) {
        categoryAddPromises.push(
          this.categoryRepository.add(newUser.id!, category, category.id)
        );
      }
      await Promise.all(categoryAddPromises);
      console.log('Added default categories');
    } catch (error) {
      /* Roll back auth user creation */
      await this.deleteAuthUser();
      throw new Error('Something went wrong');
    }
    if (tmp) newUser = tmp;
    else throw new Error('Failed to create user');
    if (newUser.id) this._currentUserIdCached = newUser.id;

    return newUser;
  }

  private async createUserSurrogateKeyAndPasswordKDFKey(
    password: string
  ): Promise<{
    base64SurrogateKey: string;
    base64PasswordHashKDFKey: string;
    base64PasswordKDFSalt: string;
  }> {
    const passwordHash = await this.cryptoService.digest(password);
    this.secureStore(USER_SECURE_STORAGE_KEY, passwordHash);
    const surrogateKey: CryptoKey = await this.cryptoService.generateKey();
    const [passwordHashKDFKey, base64Salt] =
      await this.cryptoService.deriveKeyFromPlainText(passwordHash);

    const base64SurrogateKey: string =
      await this.cryptoService.exportKeyToString(surrogateKey);
    const base64PasswordHashKDFKey: string =
      await this.cryptoService.exportKeyToString(passwordHashKDFKey);
    return {
      base64SurrogateKey,
      base64PasswordHashKDFKey,
      base64PasswordKDFSalt: base64Salt,
    };
  }
}
