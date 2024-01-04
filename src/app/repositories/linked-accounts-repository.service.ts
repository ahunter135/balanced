import { Injectable } from '@angular/core';
import { SubCollectionRepository } from './subcollection-repository';
import { LinkedAccount } from '../types/firestore/user';
import { LINKED_ACCOUNTS_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { CollectionReference, DocumentData, Query, collection, getFirestore } from 'firebase/firestore';
import { ISubCollectionRepository } from './interfaces/repository';

@Injectable({
  providedIn: 'root'
})
export class LinkedAccountsRepositoryService
  extends SubCollectionRepository<LinkedAccount>
  implements ISubCollectionRepository<LinkedAccount> {

  constructor() {
    super(LINKED_ACCOUNTS_SUBCOLLECTION_NAME);
  }

  async get(userId: string, linkedAccountId: string): Promise<LinkedAccount | undefined> {
    return super._get(LinkedAccountsRepositoryService.makeCollectionRef(userId), linkedAccountId);
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<LinkedAccount>> {
    return super._getAll();
  }

  async getAllFromParent(userId: string): Promise<FirestoreDocumentQueryResult<LinkedAccount>> {
    return super._getAllFromParent(LinkedAccountsRepositoryService.makeCollectionRef(userId));
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<LinkedAccount>> {
    return super._getByQuery(query);
  }

  async add(userId: string, linkedAccount: DocumentData, id?: string): Promise<LinkedAccount | undefined> {
    return super._add(LinkedAccountsRepositoryService.makeCollectionRef(userId), linkedAccount, id);
  }

  async update(userId: string, linkedAccountId: string, linkedAccount: DocumentData): Promise<boolean> {
    return super._update(LinkedAccountsRepositoryService.makeCollectionRef(userId), linkedAccountId, linkedAccount);
  }

  async delete(userId: string, linkedAccountId: string, shouldHardDelete: boolean = false): Promise<boolean> {
    return super._delete(LinkedAccountsRepositoryService.makeCollectionRef(userId), linkedAccountId, shouldHardDelete);
  }

  static makeCollectionRef(userId: string): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME, userId, LINKED_ACCOUNTS_SUBCOLLECTION_NAME);
  }
}
