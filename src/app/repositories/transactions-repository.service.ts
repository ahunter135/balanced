import { Injectable } from '@angular/core';
import { TRANSACTIONS_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { SubCollectionRepository } from './subcollection-repository';
import { Transaction } from '../types/firestore/user';
import { CollectionReference, DocumentData, Query, collection, getFirestore } from 'firebase/firestore';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { ISubCollectionRepository } from './interfaces/repository';

@Injectable({
  providedIn: 'root'
})
export class TransactionsRepositoryService
  extends SubCollectionRepository<Transaction>
  implements ISubCollectionRepository<Transaction> {

  constructor() {
    super(TRANSACTIONS_SUBCOLLECTION_NAME);
  }

  async get(userId: string, transactionId: string): Promise<Transaction | undefined> {
    return super._get(TransactionsRepositoryService.makeCollectionRef(userId), transactionId);
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<Transaction>> {
    return super._getAll();
  }

  async getAllFromParent(userId: string): Promise<FirestoreDocumentQueryResult<Transaction>> {
    return super._getAllFromParent(TransactionsRepositoryService.makeCollectionRef(userId));
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<Transaction>> {
    return super._getByQuery(query);
  }

  async add(userId: string, transaction: DocumentData, id?: string): Promise<Transaction | undefined> {
    return super._add(TransactionsRepositoryService.makeCollectionRef(userId), transaction, id);
  }

  async update(userId: string, transactionId: string, transaction: DocumentData): Promise<boolean> {
    return super._update(TransactionsRepositoryService.makeCollectionRef(userId), transactionId, transaction);
  }

  async delete(userId: string, transactionId: string, shouldHardDelete: boolean = false): Promise<boolean> {
    return super._delete(TransactionsRepositoryService.makeCollectionRef(userId), transactionId, shouldHardDelete);
  }

  static makeCollectionRef(userId: string): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME, userId, TRANSACTIONS_SUBCOLLECTION_NAME);
  }
}
