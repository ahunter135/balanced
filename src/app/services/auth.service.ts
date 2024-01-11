import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User as AuthUser, UserCredential, createUserWithEmailAndPassword, getIdToken, getIdTokenResult, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

import { Category, User as FirestoreUser } from '../types/firestore/user';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { CreateAccountOthers } from '../types/firestore/auth';
import { getDefaultCategories } from '../helpers/firestore/auth-helpers';
import { CategoryRepositoryService } from '../repositories/category-repository.service';
import { Observable } from 'rxjs';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUserIdCached: string | null;
  get currentUserId(): string | null { return this._currentUserIdCached; }

  currentAuthUser: Observable<AuthUser | null> = new Observable((observer) => {
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
  });

  constructor(
    private auth: Auth,
    private userRepository: UserRepositoryService,
    private categoryRepository: CategoryRepositoryService,
    private cryptoService: CryptoService,
  ) {
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user = await this.userRepository.getCurrentFirestoreUser();
      if (!user || !user.encryption_data) throw new Error("Something went wrong");
      const surrogateKeyPassword = await this.cryptoService.getSurrogateFromKDFProvider(
        password,
        user.encryption_data.surrogate_key_password,
        user.encryption_data.password_kdf_salt
      );
      this.cryptoService.surrogateKey = surrogateKeyPassword;
      this.setRefreshTokenSurrogateKey(surrogateKeyPassword);
    } catch (error: any) {
      throw new Error("Email or password is incorrect");
    }
  }

  async createAccount(email: string, password: string, other: CreateAccountOthers): Promise<FirestoreUser> {
    /* Create user in auth and firestore */
    let newFirestoreUser: FirestoreUser = await this.createUserStuff(email, password, other);

    /* Set up encryption keys */
    const { base64SurrogateKey, base64PasswordKDFKey, base64PasswordKDFSalt } = await this.createUserSurrogateKeyAndPasswordKDFKey(password);

    /* Encrypt the surrogate key with the password KDF key */
    const surrogateKeyPassword: string = await this.cryptoService.encrypt(
      base64PasswordKDFKey,
      base64SurrogateKey
    );

    /* Save the surrogate key to the crypto service */
    this.cryptoService.surrogateKey = base64SurrogateKey;

    /* Save to database */
    await this.userRepository.update(newFirestoreUser.id!, {
      encryption_data: {
        surrogate_key_password: surrogateKeyPassword,
        password_kdf_salt: base64PasswordKDFSalt,
      }
    });


    const defaultCategories: Category[] = getDefaultCategories();
    let categoryAddPromises: Promise<Category | undefined>[] = [];

    // Add categories to the user's doc
    for (let category of defaultCategories) {
      categoryAddPromises.push(
        this.categoryRepository.add(newFirestoreUser.id!, category, category.id)
      );
    }
    await Promise.all(categoryAddPromises);
    return newFirestoreUser;
  }

  async setRefreshTokenSurrogateKey(base64SurrogateKey: string): Promise<void> {
    const refreshToken = this.getRefreshToken();
    const { surrogateKey, salt } = await this.cryptoService.getKDFSurrogateAndSaltFromSurrogateKey(
      refreshToken,
      base64SurrogateKey
    );
    await this.userRepository.update(this.currentUserId!, {
      encryption_data: {
        surrogate_key_refresh_token: surrogateKey,
        refresh_token_kdf_salt: salt,
      }
    });
  }

  async logout(): Promise<Boolean> {
    try {
      await this.auth.signOut();
      this._currentUserIdCached = null;
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

  private getRefreshToken(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error("No user logged in");
    return user.refreshToken;
  }

  private async createUserStuff(email: string, password: string, other: CreateAccountOthers): Promise<FirestoreUser> {
    /* Create auth user */
    let userSignUp: UserCredential;
    try {
      userSignUp = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
    } catch (error) {
      throw new Error("Something went wrong");
    }

    let newUser: FirestoreUser = {
      email,
      id: userSignUp.user.uid,
      subscribed: false,
      name: other.name,
    };

    let tmp: FirestoreUser | undefined;
    try {
      tmp = await this.userRepository.add(newUser, newUser.id);
    } catch (error) {
      /* Roll back auth user creation */
      await this.deleteAuthUser();
      throw new Error("Something went wrong");
    }
    if (tmp) newUser = tmp;
    else throw new Error("Failed to create user");
    if (newUser.id) this._currentUserIdCached = newUser.id;

    return newUser;
  }

  private async createUserSurrogateKeyAndPasswordKDFKey(password: string): Promise<{
    base64SurrogateKey: string,
    base64PasswordKDFKey: string,
    base64PasswordKDFSalt: string,
  }> {
    const surrogateKey: CryptoKey = await this.cryptoService.generateKey();
    const [passwordKDFKey, base64Salt] = await this.cryptoService.deriveKeyFromPlainText(password);

    const base64SurrogateKey: string = await this.cryptoService.exportKeyToString(surrogateKey);
    const base64PasswordKDFKey: string = await this.cryptoService.exportKeyToString(passwordKDFKey);
    return {
      base64SurrogateKey,
      base64PasswordKDFKey,
      base64PasswordKDFSalt: base64Salt,
    };
  }

}
