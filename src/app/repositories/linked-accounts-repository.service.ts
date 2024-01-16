import { Injectable } from '@angular/core';
import { SubCollectionRepository } from './subcollection-repository';
import { LinkedAccount } from '../types/firestore/user';
import { LINKED_ACCOUNTS_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { CollectionReference, DocumentData, Query, Timestamp, collection, getFirestore } from 'firebase/firestore';
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
    const tmp = await super._get(LinkedAccountsRepositoryService.makeCollectionRef(userId), linkedAccountId);
    return this.convertTimestampToDate(tmp);
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<LinkedAccount>> {
    const tmp = await super._getAll();
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: LinkedAccount) => this.convertTimestampToDate(doc) as LinkedAccount);
    }
    return tmp;
  }

  async getAllFromParent(userId: string): Promise<FirestoreDocumentQueryResult<LinkedAccount>> {
    const tmp = await super._getAllFromParent(LinkedAccountsRepositoryService.makeCollectionRef(userId));
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: LinkedAccount) => this.convertTimestampToDate(doc) as LinkedAccount);
    }
    return tmp;
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<LinkedAccount>> {
    const tmp = await super._getByQuery(query);

    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: LinkedAccount) => this.convertTimestampToDate(doc) as LinkedAccount);
    }
    return tmp;
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

  private convertTimestampToDate(linkedAccount: LinkedAccount | undefined): LinkedAccount | undefined {
    if (!linkedAccount) return linkedAccount;
    const timestamp = linkedAccount.last_transaction_retrieval as unknown as Timestamp;
    if (timestamp) linkedAccount.last_transaction_retrieval = timestamp.toDate();
    return linkedAccount;
  }
}
