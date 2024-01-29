import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { LoadingController } from '@ionic/angular';
import {
  CREATE_FINICITY_LINK_TOKEN_URL,
  GET_FINICITY_ACCCOUNTS_BY_USER,
  GET_FINICITY_CUSTOMER_ID,
  GET_FINICITY_INSTITUTION_BY_ID,
  GET_FINICITY_TRANSACTIONS,
} from '../constants/http/urls';
import { HttpService } from './http.service';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { catchError, throwError } from 'rxjs';
import {
  FinicityConnect,
  ConnectEventHandlers,
  ConnectOptions,
  ConnectDoneEvent,
  ConnectCancelEvent,
  ConnectErrorEvent,
  ConnectRouteEvent,
} from '@finicity/connect-web-sdk';
import { plaidTransactionToFirestoreTransaction } from '../helpers/mappers/transactions';

import { FinicityAccountDetails } from '../types/finicity/finicity';
import { addDoc, collection, getFirestore } from '@angular/fire/firestore';
import { LinkedAccountsRepositoryService } from '../repositories/linked-accounts-repository.service';
import { PlaidTransaction } from '../types/plaid/plaid';
import { TransactionEvent } from './interfaces/transaction-publisher';
import { TransactionPublisherService } from './transaction-publisher.service';
import { Transaction } from '../types/firestore/user';

@Injectable({
  providedIn: 'root',
})
export class FinicityService {
  customerId: string;
  token: string;
  connectEventHandlers: ConnectEventHandlers = {
    onDone: (event: ConnectDoneEvent) => {
      this.finicityIsDone();
    },
    onCancel: (event: ConnectCancelEvent) => {},
    onError: (event: ConnectErrorEvent) => {},
    onRoute: (event: ConnectRouteEvent) => {},
    onUser: (event: any) => {},
    onLoad: () => {},
  };

  connectOptions: ConnectOptions = {
    overlay: 'rgba(224, 250, 215, 1)',
  };

  public get finicityAvailable(): boolean {
    return this.userService.isPremium;
  }
  constructor(
    private userService: UserService,
    private loadingController: LoadingController,
    private http: HttpService,
    private userRepository: UserRepositoryService,
    private linkedAccountsRepository: LinkedAccountsRepositoryService,
    private transactionPublisher: TransactionPublisherService
  ) {}

  async linkFinicityToUser(): Promise<void> {
    if (!this.finicityAvailable) return;
    const loader = await this.loadingController.create();
    await loader.present();
    this.http
      .post(CREATE_FINICITY_LINK_TOKEN_URL, {
        user_id: this.userRepository.getCurrentUserId()!,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          loader.dismiss();
          return err;
        })
      )
      .subscribe((resp) => {
        const url = resp.url;
        this.customerId = resp.customerId;
        this.token = resp.token;
        this.createFinicityHandlerLink(url);
        loader.dismiss();
      });
  }

  private createFinicityHandlerLink(url: string) {
    FinicityConnect.launch(url, this.connectEventHandlers, this.connectOptions);
  }

  /**
   * The user has linked their acccount. Now we need to retrieve that from Finicity
   * and then store the data into firestore
   */
  private async finicityIsDone() {
    const loader = await this.loadingController.create();

    await loader.present();
    this.http
      .post(GET_FINICITY_ACCCOUNTS_BY_USER, {
        user_id: this.customerId,
        token: this.token,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          loader.dismiss();
          return err;
        })
      )
      .subscribe((resp) => {
        const accounts = resp.accounts as Array<FinicityAccountDetails>;
        let uniqueCombinationSet = new Set();
        let resultArray: Array<FinicityAccountDetails> = [];

        accounts.forEach((item) => {
          let combinationKey = `${item.institutionId}-${item.customerId}`;

          if (!uniqueCombinationSet.has(combinationKey)) {
            uniqueCombinationSet.add(combinationKey);
            const now = new Date();
            const unixTimestamp = Math.floor(now.getTime() / 1000);
            resultArray.push({
              institutionId: item.institutionId,
              customerId: item.customerId,
              id: item.id,
              status: item.status,
              isFinicity: true,
              isPlaid: false,
              fromDate: unixTimestamp,
            });
          }
        });
        resultArray.forEach((item: FinicityAccountDetails) => {
          addDoc(
            collection(
              getFirestore(),
              'users',
              this.userRepository.getCurrentUserId() as string,
              'linked_accounts'
            ),
            item
          );
        });
        loader.dismiss();
      });
  }

  async getInstitutionById(id: string) {
    const loader = await this.loadingController.create();

    await loader.present();
    return new Promise((resolve, reject) => {
      this.http
        .post(GET_FINICITY_INSTITUTION_BY_ID, {
          id,
        })
        .pipe(
          catchError((err) => {
            console.log(err);
            loader.dismiss();
            reject(err);
            return throwError(err);
          })
        )
        .subscribe((resp) => {
          loader.dismiss();
          resolve(resp);
        });
    });
  }

  async getFinicityAccounts(customerId: string, institutionId: string) {
    const loader = await this.loadingController.create();

    await loader.present();
    return new Promise((resolve, reject) => {
      this.http
        .post(GET_FINICITY_ACCCOUNTS_BY_USER, {
          user_id: customerId,
        })
        .pipe(
          catchError((err) => {
            console.log(err);
            loader.dismiss();
            reject(err);
            return throwError(err);
          })
        )
        .subscribe((resp) => {
          loader.dismiss();
          console.log(resp);
          let accounts = resp.accounts;

          resolve(accounts);
        });
    });
  }

  mapToPlaidTransaction(obj: any): PlaidTransaction {
    const transactionDate = new Date(obj.transactionDate * 1000); // Convert Unix timestamp to Date
    const dateStr = transactionDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const dateTimeStr = transactionDate.toISOString(); // Full ISO string

    return {
      transaction_id: obj.id.toString(), // Assuming 'id' is unique and can be mapped to 'transaction_id'
      amount: obj.amount,
      date: dateStr,
      datetime: dateTimeStr,
      name: obj.description, // Mapped from 'description'
      merchant_name: obj.categorization?.normalizedPayeeName || '', // Use 'normalizedPayeeName' or empty if not available
      pending: obj.status.toLowerCase() !== 'active', // Assuming status 'active' means not pending
    };
  }

  async syncTransactions(endDate: Date | null) {
    const customer: any = await this.getCustomerId();
    const userId = this.userRepository.getCurrentUserId();
    if (!userId) throw new Error('User is not logged in');
    console.log(userId);
    /* Step 1: Get the user's linked accounts */
    const linkedAccounts = (
      await this.linkedAccountsRepository.getAllFromParent(userId)
    ).docs;
    if (linkedAccounts.length === 0) return;
    // Get the current date
    const now = new Date();

    // Convert to Unix timestamp (in seconds)
    let toDate = Math.floor(now.getTime() / 1000);

    const fromDate = linkedAccounts[0].fromDate;
    this.http
      .post(GET_FINICITY_TRANSACTIONS, {
        customerId: customer.id,
        fromDate,
        toDate,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return err;
        })
      )
      .subscribe((response) => {
        let addedTransactions: PlaidTransaction[] = [];
        for (let i = 0; i < response.length; i++) {
          const plaidTransaction = this.mapToPlaidTransaction(response[i]);

          addedTransactions.push(plaidTransaction);
        }

        this.finicityTransactionSyncHandler(
          addedTransactions,
          [],
          [],
          true // publishTransactionEvent
        );
      });
  }

  private async finicityTransactionSyncHandler(
    addedTransactions: PlaidTransaction[],
    removedTransactions: PlaidTransaction[],
    modifiedTransactions: PlaidTransaction[],
    publishTransactionEvent: boolean = true
  ): Promise<TransactionEvent> {
    const addedTransactionsFirestore: Transaction[] = addedTransactions.map(
      plaidTransactionToFirestoreTransaction
    );
    const removedTransactionsFirestore: Transaction[] = removedTransactions.map(
      plaidTransactionToFirestoreTransaction
    );
    const modifiedTransactionsFirestore: Transaction[] =
      modifiedTransactions.map(plaidTransactionToFirestoreTransaction);

    const event: TransactionEvent = {
      from: 'finicity',
      addedTransactions: addedTransactionsFirestore,
      removedTransactions: removedTransactionsFirestore,
      modifiedTransactions: modifiedTransactionsFirestore,
    };
    if (publishTransactionEvent) {
      this.transactionPublisher.publishEvent(event);
    }
    return event;
  }

  async getCustomerId() {
    const loader = await this.loadingController.create();

    await loader.present();
    return new Promise((resolve, reject) => {
      this.http
        .post(GET_FINICITY_CUSTOMER_ID, {
          user_id: this.userRepository.getCurrentUserId(),
        })
        .pipe(
          catchError((err) => {
            console.log(err);
            loader.dismiss();
            reject(err);
            return throwError(err);
          })
        )
        .subscribe((resp) => {
          loader.dismiss();
          resolve(resp[0]);
        });
    });
  }
}
