import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LinkedAccountsRepositoryService } from '../repositories/linked-accounts-repository.service';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { LinkedAccount, Transaction } from '../types/firestore/user';
import { catchError, lastValueFrom } from 'rxjs';
import {
  CREATE_PLAID_LINK_TOKEN_URL,
  GET_TRANSACTION_DATA_URL,
  EXCHANGE_PLAID_PUBLIC_TOKEN_URL,
  REMOVE_LINKED_ACCOUNT_URL,
  CREATE_PLAID_UPDATE_LINK_TOKEN_URL,
} from '../constants/http/urls';
import {
  PlaidHandler,
  PlaidOnSuccessMetadata,
  PlaidTransaction,
} from '../types/plaid/plaid';
import { plaidTransactionToFirestoreTransaction } from '../helpers/mappers/transactions';
import { TransactionPublisherService } from './transaction-publisher.service';
import { LoadingController } from '@ionic/angular';
import { TransactionEvent } from './interfaces/transaction-publisher';
import { UserService } from './user.service';

declare var Plaid: any;

@Injectable({
  providedIn: 'root',
})
export class PlaidService {
  public get plaidAvailable(): boolean {
    return this.userService.isPremium;
  }

  constructor(
    private http: HttpService,
    private linkedAccountsRepository: LinkedAccountsRepositoryService,
    private userRepository: UserRepositoryService,
    private transactionPublisher: TransactionPublisherService,
    private loadingController: LoadingController,
    private userService: UserService
  ) {}

  async linkPlaidToUser(): Promise<void> {
    if (!this.plaidAvailable) return;
    const loader = await this.loadingController.create();
    await loader.present();
    this.http
      .post(CREATE_PLAID_LINK_TOKEN_URL, {
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
        console.log(resp);
        const handler = this.createPlaidHandlerLink(resp.link_token);
        loader.dismiss();
        handler.open();
      });
  }

  async syncPlaidTransactions(): Promise<void> {
    if (!this.plaidAvailable) return;
    const userId = this.userRepository.getCurrentUserId();
    if (!userId) throw new Error('User is not logged in');

    /* Step 1: Get the user's linked accounts */
    const linkedAccounts = (
      await this.linkedAccountsRepository.getAllFromParent(userId)
    ).docs;
    if (linkedAccounts.length === 0) return;

    /* Step 2: Get the transactions from Plaid */
    const promises: Promise<any>[] = [];
    for (let linkedAccount of linkedAccounts) {
      if (linkedAccount.isPlaid) {
        if (!(await this.shouldSyncTransactions(linkedAccount))) continue;
        promises.push(
          lastValueFrom(
            this.http.post(GET_TRANSACTION_DATA_URL, {
              userId,
              linkedAccount: linkedAccount,
              linkedAccountId: linkedAccount.id!,
            })
          )
        );
      }
    }
    const responses = await Promise.all(promises);

    /* Step 3: Get the transactions from http responses */
    let addedTransactions: PlaidTransaction[] = [];
    let removedTransactions: PlaidTransaction[] = [];
    let modifiedTransactions: PlaidTransaction[] = [];
    for (let i = 0; i < responses.length; i++) {
      const resp = responses[i];
      addedTransactions = addedTransactions.concat(resp.added);
      removedTransactions = removedTransactions.concat(resp.removed);
      modifiedTransactions = modifiedTransactions.concat(resp.modified);
    }
    this.plaidTransactionSyncHandler(
      addedTransactions,
      removedTransactions,
      modifiedTransactions,
      true // publishTransactionEvent
    );
  }

  async removePlaidLinkedAccount(linkedAccount: LinkedAccount): Promise<void> {
    const userId = this.userRepository.getCurrentUserId();
    if (!userId) throw new Error('User is not logged in');

    this.http
      .post(REMOVE_LINKED_ACCOUNT_URL, {
        user_id: userId,
        linked_account_id: linkedAccount.id,
      })
      .subscribe((resp) => {
        console.log(resp);
      });
  }

  async relinkPlaidLinkedAccount(
    linkedAccount: LinkedAccount,
    successCallback?: (linkedAccountId: string) => void
  ): Promise<void> {
    if (!this.plaidAvailable) return;
    const loader = await this.loadingController.create();
    await loader.present();
    this.http
      .post(CREATE_PLAID_UPDATE_LINK_TOKEN_URL, {
        user_id: this.userRepository.getCurrentUserId()!,
        linked_account_id: linkedAccount.id!,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          loader.dismiss();
          return err;
        })
      )
      .subscribe((resp) => {
        console.log(resp);
        const handler = this.createPlaidHandlerRelink(
          resp.link_token,
          this.userRepository.getCurrentUserId()!,
          linkedAccount.id!,
          successCallback
        );
        loader.dismiss();
        handler.open();
      });
  }

  private createPlaidHandlerLink(token: string): PlaidHandler {
    return Plaid.create({
      token,
      onSuccess: this.plaidHandlerOnSuccessCallback.bind(this),
      onExit: this.plaidHandlerOnExitCallback.bind(this),
      onLoad: this.plaidHandlerOnLoadCallback.bind(this),
      onEvent: this.plaidHandlerOnEventCallback.bind(this),
      receivedRedirectUri: null,
    });
  }

  private createPlaidHandlerRelink(
    token: string,
    userId: string,
    linkedAccountId?: string,
    successCallback?: (linkedAccountId: string) => void
  ): PlaidHandler {
    return Plaid.create({
      token,
      // On success, change the required action to NONE
      onSuccess: (publicToken: string, metadata: PlaidOnSuccessMetadata) => {
        if (!linkedAccountId) return;
        this.linkedAccountsRepository
          .update(userId, linkedAccountId, {
            link_status: {
              required_action: 'NONE',
            },
          })
          .then((success: boolean) => {
            if (success && successCallback) successCallback(linkedAccountId);
          });
      },
      onExit: this.plaidHandlerOnExitCallback.bind(this),
      onLoad: this.plaidHandlerOnLoadCallback.bind(this),
      onEvent: this.plaidHandlerOnEventCallback.bind(this),
      receivedRedirectUri: null,
    });
  }

  private plaidHandlerOnSuccessCallback(
    publicToken: string,
    metadata: PlaidOnSuccessMetadata
  ): void {
    this.http
      .post(
        EXCHANGE_PLAID_PUBLIC_TOKEN_URL,
        {
          publicToken,
          institutionName: metadata.institution.name,
          userId: this.userRepository.getCurrentUserId()!,
        }
        /* TODO: Change EXCHANGE_PLAID_PUBLIC_TOKEN_URL to return
         * the transactions of current day. Make backend store these
         * fields because they are secret. */
      )
      .subscribe((resp) => {
        console.log(resp);
        const { added, removed, modified } = resp;
        this.plaidTransactionSyncHandler(
          added,
          removed,
          modified,
          true // publishTransactionEvent
        );
      });
  }

  private async plaidHandlerOnExitCallback(
    error: object | null,
    metadata: object
  ): Promise<void> {
    console.log(error);
  }

  private async plaidHandlerOnLoadCallback(): Promise<void> {}

  private async plaidHandlerOnEventCallback(
    eventName: string,
    metadata: object
  ): Promise<void> {}

  /** Function that takes transactions from sync data and handles them according
   * to the parameters passed in.
   */
  private async plaidTransactionSyncHandler(
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
      from: 'plaid',
      addedTransactions: addedTransactionsFirestore,
      removedTransactions: removedTransactionsFirestore,
      modifiedTransactions: modifiedTransactionsFirestore,
    };
    if (publishTransactionEvent) {
      this.transactionPublisher.publishEvent(event);
    }
    return event;
  }

  private async shouldSyncTransactions(
    linkedAccount: LinkedAccount
  ): Promise<boolean> {
    if (!linkedAccount.last_transaction_retrieval) return true;
    const now = new Date();
    const lastSync = linkedAccount.last_transaction_retrieval;
    const diff = now.getTime() - lastSync.getTime();
    return diff > 1000 * 60 * 5;
  }
}
