import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LinkedAccountsRepositoryService } from '../repositories/linked-accounts-repository.service';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { LinkedAccount, Transaction } from '../types/firestore/user';
import { catchError, forkJoin, lastValueFrom } from 'rxjs';
import { TransactionsRepositoryService } from '../repositories/transactions-repository.service';
import {
  CREATE_PLAID_LINK_TOKEN_URL,
  GET_TRANSACTION_DATA_URL,
  EXCHANGE_PLAID_PUBLIC_TOKEN_URL,
  GET_INSTITUTION_NAME_URL,
} from '../constants/http/urls';
import { PlaidHandler, PlaidOnSuccessMetadata, PlaidTransaction } from '../types/plaid/plaid';
import { plaidTransactionToFirestoreTransaction } from '../helpers/mappers/transactions';
import { generateRandomId } from '../utils/generation';
import { TransactionPublisherService } from './transaction-publisher.service';
import { LoadingController } from '@ionic/angular';

declare var Plaid: any;

@Injectable({
  providedIn: 'root'
})
export class PlaidService {
  constructor(
    private http: HttpService,
    private linkedAccountsRepository: LinkedAccountsRepositoryService,
    private transactionRepository: TransactionsRepositoryService,
    private userRepository: UserRepositoryService,
    private transactionPublisher: TransactionPublisherService,
    private loadingController: LoadingController,
  ) {
  }

  async linkPlaidToUser(): Promise<void> {
    const loader = await this.loadingController.create();
    await loader.present();
    this.http.post(
      CREATE_PLAID_LINK_TOKEN_URL,
      {
        user_id: this.userRepository.getCurrentUserId()!,
      }
    ).pipe(catchError((err) => {
      console.log(err);
      loader.dismiss();
      return err;
    })).subscribe((resp) => {
      console.log(resp);
      const handler = this.createPlaidHandler(resp.link_token);
      loader.dismiss();
      handler.open();
    });
  }

  async syncPlaidTransactions(
    startDate: Date | null = null,
    endDate: Date | null = null,
  ): Promise<Transaction[]> {
    /* Step 1: Get the user's linked accounts */
    const linkedAccounts = (await this.linkedAccountsRepository.getAllFromParent(
      this.userRepository.getCurrentUserId()!
    )).docs;
    if (linkedAccounts.length === 0)
      return [];

    /* Step 2: Get the transactions from Plaid */
    const promises: Promise<any>[] = [];
    for (let linkedAccount of linkedAccounts) {
      if (!(await this.shouldSyncTransactions(linkedAccount)))
        continue;
      promises.push(
        lastValueFrom(
          this.http.post(
            GET_TRANSACTION_DATA_URL,
            {
              accessToken: linkedAccount.access_token,
              cursor: linkedAccount.transaction_sync_cursor,
            }
          )
        )
      );
    }
    const responses = await Promise.all(promises);

    /* Step 3: Get the transactions from http responses */
    let addedTransactions: Transaction[] = [];
    let removedTransactions: Transaction[] = [];
    let modifiedTransactions: Transaction[] = [];
    for (let i = 0; i < responses.length; i++) {
      const resp = responses[i];
      const tmp = await this.handlePlaidSyncResponse(resp, startDate, endDate);
      addedTransactions = addedTransactions.concat(tmp.addedTransactions as Transaction[]);
      removedTransactions = removedTransactions.concat(tmp.removedTransactions as Transaction[]);
      modifiedTransactions = modifiedTransactions.concat(tmp.modifiedTransactions as Transaction[]);
      this.linkedAccountsRepository.update(
        this.userRepository.getCurrentUserId()!,
        linkedAccounts[i].id!,
        {
          last_transaction_retrieval: new Date(),
          transaction_sync_cursor: resp.cursor,
        }
      );
    }
    this.transactionPublisher.publishEvent({
      from: 'plaid',
      addedTransactions,
      removedTransactions,
      modifiedTransactions,
    });
    return addedTransactions;
  }

  async getInstitutionName(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          GET_INSTITUTION_NAME_URL,
          {
            accessToken: token,
          }
        )
        .subscribe((resp) => {
          console.log(resp);
          resolve(resp.name);
        });
    });
  }

  private createPlaidHandler(token: string): PlaidHandler {
    return Plaid.create({
      token,
      onSuccess: this.plaidHandlerOnSuccessCallback.bind(this),
      onExit: this.plaidHandlerOnExitCallback.bind(this),
      onLoad: this.plaidHandlerOnLoadCallback.bind(this),
      onEvent: this.plaidHandlerOnEventCallback.bind(this),
      receivedRedirectUri: null,
    });
  }

  private plaidHandlerOnSuccessCallback(publicToken: string, metadata: PlaidOnSuccessMetadata): void {
    this.http.post(
      EXCHANGE_PLAID_PUBLIC_TOKEN_URL,
      {
        publicToken,
      },
    ).subscribe((resp) => {
      console.log(resp);
      const { access_token, item_id } = resp;
      const id = generateRandomId();
      const institutionName = metadata.institution.name;
      /* Add linked account to database */
      this.linkedAccountsRepository.add(
        this.userRepository.getCurrentUserId()!,
        {
          access_token,
          institution: item_id,
          institution_name: institutionName,
        },
        id,
      );
    });
  }

  private async plaidHandlerOnExitCallback(error: object | null, metadata: object): Promise<void> {
    console.log(error);
  }

  private async plaidHandlerOnLoadCallback(): Promise<void> {
  }

  private async plaidHandlerOnEventCallback(eventName: string, metadata: object): Promise<void> {
  }

  private async handlePlaidSyncResponse(
    resp: any,
    startDate: Date | null,
    endDate: Date | null,
  ): Promise<any> {
    console.log(resp);
    const addedTransactions: Transaction[] = resp.added.filter((t: PlaidTransaction) => {
      if (!startDate && !endDate) return true;
      let isValid = true;
      if (startDate) {
        isValid = isValid && new Date(t.date) >= startDate;
      }
      if (endDate) {
        isValid = isValid && new Date(t.date) <= endDate;
      }
      return isValid;
    }).map(plaidTransactionToFirestoreTransaction);
    const removedTransactions: Transaction[] = resp.removed.map(plaidTransactionToFirestoreTransaction);
    const modifiedTransactions: Transaction[] = resp.modified.map(plaidTransactionToFirestoreTransaction);
    /* Add new transactions to the database */
    addedTransactions.forEach(async (t) => {
      this.transactionRepository.add(this.userRepository.getCurrentUserId()!, t, t.id!);
    });
    /* Remove transactions from the database */
    removedTransactions.forEach(async (t) => {
      this.transactionRepository.delete(this.userRepository.getCurrentUserId()!, t.id!, true);
    });
    /* Update transactions in the database */
    modifiedTransactions.forEach(async (t) => {
      this.transactionRepository.update(this.userRepository.getCurrentUserId()!, t.id!, t);
    });
    return {
      cursor: resp.cursor,
      addedTransactions,
      removedTransactions,
      modifiedTransactions,
    };
  }

  private async shouldSyncTransactions(linkedAccount: LinkedAccount): Promise<boolean> {
    if (!linkedAccount.last_transaction_retrieval) return true;
    const now = new Date();
    const lastSync = linkedAccount.last_transaction_retrieval;
    const diff = now.getTime() - lastSync.getTime();
    return diff > 1000 * 60 * 5;
  }
}
