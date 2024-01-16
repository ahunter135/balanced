import { Injectable } from '@angular/core';
import { TRANSACTIONS_SUBCOLLECTION_NAME, USER_COLLECTION_NAME } from '../constants/firestore/collection-names';
import { SubCollectionRepository } from './subcollection-repository';
import { Transaction } from '../types/firestore/user';
import { CollectionReference, DocumentData, Query, Timestamp, collection, getFirestore } from 'firebase/firestore';
import { FirestoreDocumentQueryResult } from '../types/firestore/doc-data';
import { ISubCollectionRepository } from './interfaces/repository';
import { CryptoService } from '../services/crypto.service';
import { TRANSACTION_ENCRYPTED_FIELDS } from '../constants/crypto/crypto';
import { CLONE_PROPERTY } from '../helpers/firestore/repository-helpers';

@Injectable({
  providedIn: 'root'
})
export class TransactionsRepositoryService
  extends SubCollectionRepository<Transaction>
  implements ISubCollectionRepository<Transaction> {

  constructor(
    private cryptoService: CryptoService,
  ) {
    super(TRANSACTIONS_SUBCOLLECTION_NAME);
  }

  async get(userId: string, transactionId: string): Promise<Transaction | undefined> {
    let tmp = await super._get(TransactionsRepositoryService.makeCollectionRef(userId), transactionId);
    /* Convert the Firebase Timestamp to a Date */
    tmp = this.convertTimestampToDate(tmp);
    /* Decrypt the encrypted fields */
    tmp = await this.prepareTransactionForClient(tmp);
    return tmp;
  }

  async getAll(): Promise<FirestoreDocumentQueryResult<Transaction>> {
    const tmp = await super._getAll();
    /* Convert the Firebase Timestamp to a Date */
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: Transaction) => this.convertTimestampToDate(doc) as Transaction);
      for (let i = 0; i < tmp.docs.length; i++) {
        tmp.docs[i] = await this.prepareTransactionForClient(tmp.docs[i]) as Transaction;
      }
    }
    return tmp;
  }

  async getAllFromParent(userId: string): Promise<FirestoreDocumentQueryResult<Transaction>> {
    const tmp = await super._getAllFromParent(TransactionsRepositoryService.makeCollectionRef(userId));
    /* Convert the Firebase Timestamp to a Date */
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: Transaction) => this.convertTimestampToDate(doc) as Transaction);
      for (let i = 0; i < tmp.docs.length; i++) {
        tmp.docs[i] = await this.prepareTransactionForClient(tmp.docs[i]) as Transaction;
      }
    }
    return tmp;
  }

  async getByQuery(query: Query<DocumentData>): Promise<FirestoreDocumentQueryResult<Transaction>> {
    const tmp = await super._getByQuery(query);
    /* Convert the Firebase Timestamp to a Date */
    if (tmp.docs) {
      tmp.docs = tmp.docs.map((doc: Transaction) => this.convertTimestampToDate(doc) as Transaction);
      for (let i = 0; i < tmp.docs.length; i++) {
        tmp.docs[i] = await this.prepareTransactionForClient(tmp.docs[i]) as Transaction;
      }
    }
    return tmp;
  }

  async add(userId: string, transaction: DocumentData, id?: string): Promise<Transaction | undefined> {
    const transactionCopy = await this.prepareTransactionForFirestore(transaction as Transaction);
    if (!transactionCopy) return transactionCopy;
    return super._add(TransactionsRepositoryService.makeCollectionRef(userId), transactionCopy, id);
  }

  async update(userId: string, transactionId: string, transaction: DocumentData): Promise<boolean> {
    const transactionCopy = await this.prepareTransactionForFirestore(transaction as Transaction);
    if (!transactionCopy) return false;
    return super._update(TransactionsRepositoryService.makeCollectionRef(userId), transactionId, transactionCopy);
  }

  async delete(userId: string, transactionId: string, shouldHardDelete: boolean = false): Promise<boolean> {
    return super._delete(TransactionsRepositoryService.makeCollectionRef(userId), transactionId, shouldHardDelete);
  }

  static makeCollectionRef(userId: string): CollectionReference<DocumentData> {
    return collection(getFirestore(), USER_COLLECTION_NAME, userId, TRANSACTIONS_SUBCOLLECTION_NAME);
  }

  /* Removes all sensitive data from the transaction object and encrypts them */
  private async prepareTransactionForFirestore(transaction: Transaction | undefined)
    :Promise<Transaction | undefined> {
    if (!transaction) return transaction;
    let transactionCopy = structuredClone(transaction);
    transactionCopy[CLONE_PROPERTY] = true;

    let sensitiveObj: any = {};
    TRANSACTION_ENCRYPTED_FIELDS.forEach((field) => {
      sensitiveObj[field] = transaction[field];
      delete transactionCopy[field];
    });

    const base64EncryptedObjString = await this.cryptoService.encryptObject(sensitiveObj);
    transactionCopy.encrypted_string = base64EncryptedObjString;

    return transactionCopy;
  }

  /* Decrypts all sensitive data from the transaction object and adds them back */
  private async prepareTransactionForClient(transaction: Transaction | undefined)
    : Promise<Transaction | undefined> {
    if (!transaction) return transaction;
    let transactionCopy = structuredClone(transaction);

    const base64EncryptedObjString = transactionCopy.encrypted_string;
    delete transactionCopy.encrypted_string;

    const decryptedObj = await this.cryptoService.decryptObject(base64EncryptedObjString);
    TRANSACTION_ENCRYPTED_FIELDS.forEach((field) => {
      transactionCopy[field] = decryptedObj[field];
    });
    console.log(transactionCopy);

    return transactionCopy;
  }

  private convertTimestampToDate(transaction: Transaction | undefined): Transaction | undefined {
    if (!transaction) return transaction;
    const timestamp = transaction.date as unknown as Timestamp;
    transaction.date = timestamp.toDate();
    return transaction;
  }
}
