import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserInt } from '../interfaces/user';
import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { HttpService } from './http.service';
import { Transaction } from '../interfaces/transaction';
import { forkJoin, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private activeUser: User | UserInt | null;
  private pendingTransactions: Array<Transaction> = [];
  constructor(private http: HttpService) {}

  public getActiveUser() {
    return this.activeUser;
  }

  public setActiveUser(user: User | UserInt | null) {
    this.activeUser = user;
  }

  public getPendingTransactions() {
    return this.pendingTransactions;
  }
  public setPendingTransactions(transactions: Array<Transaction>) {
    this.pendingTransactions = transactions;
  }

  public async getUserTransactionsFromPlaid(user: UserInt) {
    let new_transactions: Array<Transaction>;
    // Step 1: Get the users linked accounts
    const linkedAccountsSnapshot: any = await getDocs(
      query(
        collection(
          getFirestore(),
          'users',
          this.activeUser?.uid as string,
          'linked_accounts'
        )
      )
    );

    const promises: Promise<any>[] = [];

    linkedAccountsSnapshot.forEach((element: any) => {
      const access_token = element.data()['access_token'];

      const promise = lastValueFrom(
        this.http.post(
          'https://us-central1-balanced-budget-90f1f.cloudfunctions.net/getTransactionData',
          {
            accessToken: access_token,
            cursor: element.data()['transaction_sync_cursor'],
          }
        )
      );

      promises.push(promise);
    });

    // Wait for all promises to resolve
    forkJoin(promises).subscribe(async (responses) => {
      responses.forEach((resp, index) => {
        const element = linkedAccountsSnapshot.docs[index];
        // Get new Transactions
        new_transactions = resp.added;
        new_transactions = this.removeOldTransactions(new_transactions);
        new_transactions = this.sortTransactions(new_transactions);
        this.pendingTransactions = [
          ...this.pendingTransactions,
          ...new_transactions,
        ];

        updateDoc(
          doc(
            getFirestore(),
            'users',
            this.activeUser?.uid as string,
            'linked_accounts',
            element.id
          ),
          {
            last_transaction_retrieval: new Date().toISOString(),
            transaction_sync_cursor: resp.cursor,
          }
        );
      });
      // Step 2: We need to grab existing transactions that are pending
      await this.getExistingPendingTransactions();

      // Step 3: We got all the new transactions, lets add them to the transactions collection but as pending: true
      await this.addTransactions(new_transactions);

      // Done
      // we now have all existing pending and newly added pending transactions
      this.sortTransactions(this.pendingTransactions);
    });
  }

  private sortTransactions(new_transactions: any) {
    new_transactions.sort((a: any, b: any) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return new_transactions;
  }

  /**
   * We don't want any transactions older than 2 weeks old.
   * Remove them
   * @param new_transactions
   */
  private removeOldTransactions(new_transactions: any) {
    const new_transaction_array = [];
    for (let i = 0; i < new_transactions.length; i++) {
      const today: Date = new Date();
      const transaction_date: Date = new Date(new_transactions[i].date);

      const differenceInMs: number =
        today.getTime() - transaction_date.getTime();
      const twoWeeksInMs: number = 14 * 24 * 60 * 60 * 1000;

      if (!(differenceInMs > twoWeeksInMs)) {
        new_transaction_array.push(new_transactions[i]);
      }
    }

    return new_transaction_array;
  }

  private async addTransactions(new_transactions: Array<Transaction>) {
    let promises: Promise<any>[] = [];
    new_transactions.forEach((transaction: any) => {
      transaction = this.mapTransaction(transaction);
      let promise = setDoc(
        doc(
          getFirestore(),
          'users',
          this.activeUser?.uid as string,
          'transactions',
          transaction.id
        ),
        {
          ...transaction,
        }
      );

      promises.push(promise);
    });

    await Promise.all(promises);
  }

  private mapTransaction(transaction: any) {
    const new_transaction: Transaction = {
      id: transaction.transaction_id,
      amount: transaction.amount * 100,
      category: '',
      date: transaction.date,
      name: transaction.name,
      merchant_name: transaction.merchant_name,
      pending: true,
    };

    return new_transaction;
  }

  private async getExistingPendingTransactions() {
    const pendingDocsSnapshot = await getDocs(
      query(
        collection(
          getFirestore(),
          'users',
          this.activeUser?.uid as string,
          'transactions'
        ),
        where('pending', '==', true)
      )
    );
    pendingDocsSnapshot.forEach((element) => {
      this.pendingTransactions.push(element.data() as Transaction);
    });
  }

  generateRandomId() {
    // Generate a random number and convert it to a hexadecimal string
    const randomNumber = Math.floor(Math.random() * 1000000);
    const randomHex = randomNumber.toString(16);

    // Get the current timestamp and convert it to a hexadecimal string
    const timestamp = Date.now().toString(16);

    // Concatenate the timestamp and random number to create the ID
    const randomId = timestamp + randomHex;

    return randomId;
  }
}
