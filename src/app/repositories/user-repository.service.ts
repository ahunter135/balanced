import { Injectable } from '@angular/core';
import { CollectionRepository } from './collection-repository';
import { User } from '../types/firestore/user';
import { CollectionReference, DocumentData, collection, getFirestore } from 'firebase/firestore';
import { USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
/* I don't want to use this but cannot import Authservice because of circular dependency */
import { getAuth } from 'firebase/auth';
import { CryptoService } from '../services/crypto.service';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { CLONE_PROPERTY, isObjectClone } from '../helpers/firestore/repository-helpers';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService
  extends CollectionRepository<User> {

  private cachedUser?: User;

  constructor(
    private cryptoService: CryptoService,
    private auth: Auth,
  ) {
    super(collection(getFirestore(), USER_COLLECTION_NAME));
  }

  currentFirestoreUser: Observable<User | undefined> = new Observable((observer) => {
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        const firestoreUser = await this.getCurrentFirestoreUser();
        observer.next(firestoreUser);
      } else {
        observer.next(undefined);
      }
    });
  });

  override async add(user: DocumentData, id?: string): Promise<User | undefined> {
    user = this.cloneAndRemovePropertiesUser(user);
    return super.add(user, id);
  }

  override async update(userId: string, user: DocumentData): Promise<boolean> {
    user = this.cloneAndRemovePropertiesUser(user);
    return super.update(userId, user);
  }

  /** Get the current user from Firestore
  * @param ignoreCached Whether to ignore the cached user. Set to true to force a new fetch.
  * @returns The current user, or undefined if not logged in.
  */
  async getCurrentFirestoreUser(ignoreCached: boolean = true): Promise<User | undefined> {
    if (!ignoreCached && this.cachedUser) {
      return this.cachedUser;
    }
    const authUserId = this.getCurrentUserId();
    if (!authUserId) {
      return undefined;
    }

    const user = await this.get(authUserId);
    if (user) {
      /* Set the surrogate key in the crypto service */
      await this.setSurrogateKey(user);
    }
    this.cachedUser = user;
    return user;
  }

  /* Clear the cached user when the user logs out
  *  Must be called from somewhere. It does not listen
  *  for the event itself.
  */
  onUserLoggedOut() {
    this.cachedUser = undefined;
  }

  getCurrentUserId(): string | null {
    return getAuth().currentUser?.uid ?? null;
  }

  static makeCollectionRef(): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME);
  }

  private async setSurrogateKey(user: User): Promise<void> {
    // Don't work twice
    if (this.cryptoService.surrogateKey)
      return;

    if (!this.auth.currentUser || !this.auth.currentUser.refreshToken)
      return;

    if (!user.encryption_data)
      return;
    /* Silently fail when the user does not have a refresh token.
      * Login function handles this case.
      */
    try {
      const surrogateKey = await this.cryptoService.getSurrogateFromKDFProvider(
        this.auth.currentUser.refreshToken,
        user.encryption_data.surrogate_key_refresh_token,
        user.encryption_data.refresh_token_kdf_salt
      );
      this.cryptoService.surrogateKey = surrogateKey;
    } catch (error) {
      console.error(error);
    }
  }

  private cloneAndRemovePropertiesUser(item: DocumentData): DocumentData {
    if (!isObjectClone(item)) {
      item = structuredClone(item);
      item[CLONE_PROPERTY] = true;
    }
    if (item['categories']) {
      delete item['categories'];
    }
    return item;
  }
}
