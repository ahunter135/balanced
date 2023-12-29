import { Injectable } from '@angular/core';
import { CollectionRepository } from './collection-repository';
import { User } from '../types/firestore/user';
import { CollectionReference, DocumentData, collection, getFirestore } from 'firebase/firestore';
import { USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService
  extends CollectionRepository<User> {

  constructor(
    private authService: AuthService,
  ) {
    super(collection(getFirestore(), USER_COLLECTION_NAME));
  }

  async getCurrentFirestoreUser(): Promise<User | undefined> {
    const authUser = await this.authService.getCurrentAuthUser();
    if (!authUser) {
      return undefined;
    }

    return this.get(authUser.uid);
  }

  getCurrentUserId(): string | null {
    return this.authService.currentUserId;
  }

  static makeCollectionRef(): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME);
  }
}
