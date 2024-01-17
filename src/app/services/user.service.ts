import { Injectable } from '@angular/core';
import {
  User as FirestoreUser,
  Transaction,
} from 'src/app/types/firestore/user';
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  getDoc,
  where,
} from '@angular/fire/firestore';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isPremium: boolean;
  constructor(private http: HttpService, private authService: AuthService) {
    this.authService.getCurrentAuthUser().then(async (data) => {
      if (data) {
        const userDoc = await getDoc(
          doc(getFirestore(), 'users', data.uid as string)
        );
        if (userDoc.exists()) {
          this.isPremium = userDoc.data()['subscribed'];
        }
      }
    });
  }

  public async updatePremiumStatus(isPremium: boolean) {
    const user = await this.authService.getCurrentAuthUser();
    this.isPremium = isPremium;
    updateDoc(doc(getFirestore(), 'users', user?.uid as string), {
      subscribed: isPremium,
      token: this.authService.userToken,
    });
  }

  /* Replaced with functin in transaction.service.ts. Keeping for reference until new function is tested
  public async getUserTransactionsFromPlaid(user: FirestoreUser) {
    let new_transactions: Array<Transaction>;
    // Step 1: Get the users linked accounts
    const linkedAccountsSnapshot: any = await getDocs(
      query(
        collection(
          getFirestore(),
          'users',
          this.activeUser['uid'] as string,
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
            this.activeUser['uid'] as string,
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
  */

  /**
   * We don't want any transactions older than 2 weeks old.
   * Remove them
   * @param new_transactions
   */
  /* Keep for reference until new function is tested
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
  */
}
