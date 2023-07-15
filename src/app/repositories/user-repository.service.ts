import { Injectable } from '@angular/core';
import { CollectionRepository } from './collection-repository';
import { User } from '../types/firestore/user';
import { CollectionReference, DocumentData, collection, getFirestore } from 'firebase/firestore';
import { USER_COLLECTION_NAME } from '../constants/firestore/collection-names';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService
  extends CollectionRepository<User> {

  constructor() {
    super(collection(getFirestore(), USER_COLLECTION_NAME));
  }

  static makeCollectionRef(): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME);
  }
}
