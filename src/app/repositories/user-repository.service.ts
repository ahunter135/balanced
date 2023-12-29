import { Injectable } from '@angular/core';
import { CollectionRepository } from './collection-repository';
import { User } from '../types/firestore/user';
import { CollectionReference, DocumentData, collection, getFirestore } from 'firebase/firestore';
import { USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
/* I don't want to use this but cannot import Authservice because of circular dependency */
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService
  extends CollectionRepository<User> {

  private cachedUser?: User;

  constructor() {
    super(collection(getFirestore(), USER_COLLECTION_NAME));
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
}
