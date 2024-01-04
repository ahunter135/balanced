import { Injectable } from '@angular/core';
import { TRANSACTIONS_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { SubCollectionRepository } from './subcollection-repository';
import { Transaction } from '../types/firestore/user';
import { CollectionReference, DocumentData, Query, Timestamp, collection, getFirestore } from 'firebase/firestore';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { ISubCollectionRepository } from './interfaces/repository';
import { doc, runTransaction } from 'firebase/firestore';
import { SubcategoryRepositoryService } from './subcategory-repository.service';

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
    const tmp = await super._get(TransactionsRepositoryService.makeCollectionRef(userId), transactionId);
    /* Convert the Firebase Timestamp to a Date */
    return this.convertTimestampToDate(tmp);
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<Transaction>> {
    const tmp = await super._getAll();
    /* Convert the Firebase Timestamp to a Date */
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: Transaction) => this.convertTimestampToDate(doc) as Transaction);
    }
    return tmp;
  }

  async getAllFromParent(userId: string): Promise<FirestoreDocumentQueryResult<Transaction>> {
    const tmp = await super._getAllFromParent(TransactionsRepositoryService.makeCollectionRef(userId));
    /* Convert the Firebase Timestamp to a Date */
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: Transaction) => this.convertTimestampToDate(doc) as Transaction);
    }
    return tmp;
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<Transaction>> {
    const tmp = await super._getByQuery(query);
    /* Convert the Firebase Timestamp to a Date */
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: Transaction) => this.convertTimestampToDate(doc) as Transaction);
    }
    return tmp;
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

  private convertTimestampToDate(transaction: Transaction | undefined): Transaction | undefined {
    if (!transaction) return transaction;
    const timestamp = transaction.date as unknown as Timestamp;
    transaction.date = timestamp.toDate();
    return transaction;
  }
}
