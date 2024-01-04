import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LinkedAccountsRepositoryService } from '../repositories/linked-accounts-repository.service';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { Transaction } from '../types/firestore/user';
import { forkJoin, lastValueFrom } from 'rxjs';
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
  ) {
  }

  async linkPlaidToUser(): Promise<void> {
    this.http.post(
      CREATE_PLAID_LINK_TOKEN_URL,
      {
        user_id: this.userRepository.getCurrentUserId()!,
      }
    ).subscribe((resp) => {
      console.log(resp);
      const handler = this.createPlaidHandler(resp.link_token);
      handler.open();
    });

  }

  async getTransactionsFromPlaid(): Promise<Transaction[]> {
    /* Step 1: Get the user's linked accounts */
    const linkedAccounts = (await this.linkedAccountsRepository.getAllFromParent(
      this.userRepository.getCurrentUserId()!
    )).docs;
    if (linkedAccounts.length === 0)
      return [];

    /* Step 2: Get the transactions from Plaid */
    const promises: Promise<any>[] = [];
    for (let linkedAccount of linkedAccounts) {
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

    /* Step 3: Get the transactions from http responses */
    let addedTransactions: PlaidTransaction[] = [];
    let removedTransactions: PlaidTransaction[] = [];
    let modifiedTransactions: PlaidTransaction[] = [];
    forkJoin(promises).subscribe((responses) => {
      responses.forEach((resp, index) => {
        const linkedAccount = linkedAccounts[index]; /* TODO: Make sure this is the right index */
        addedTransactions = addedTransactions.concat(resp.added);
        removedTransactions = removedTransactions.concat(resp.removed);
        modifiedTransactions = modifiedTransactions.concat(resp.modified);
        /* Update the cursor and last transaction retrieval date */
        this.linkedAccountsRepository.update(
          this.userRepository.getCurrentUserId()!,
          linkedAccount.id!,
          {
            last_transaction_retrieval: new Date(),
            transaction_sync_cursor: resp.cursor,
          }
        );
      });
    });
    const addedTransactionsFB: Transaction[] = addedTransactions.map(
      plaidTransactionToFirestoreTransaction);
    const removedTransactionsFB: Transaction[] = removedTransactions.map(
      plaidTransactionToFirestoreTransaction);
    const modifiedTransactionsFB: Transaction[] = modifiedTransactions.map(
      plaidTransactionToFirestoreTransaction);
    /* Add new transactions to the database */
    addedTransactionsFB.forEach(async (t) => {
      this.transactionRepository.add(this.userRepository.getCurrentUserId()!, t, t.id!);
    });
    /* Remove transactions from the database */
    removedTransactionsFB.forEach(async (t) => {
      this.transactionRepository.delete(this.userRepository.getCurrentUserId()!, t.id!);
    });
    /* Update transactions in the database */
    modifiedTransactionsFB.forEach(async (t) => {
      this.transactionRepository.update(this.userRepository.getCurrentUserId()!, t.id!, t);
    });
    this.transactionPublisher.publishEvent({
      addedTransactions: addedTransactionsFB,
      removedTransactions: removedTransactionsFB,
      modifiedTransactions: modifiedTransactionsFB,
    });
    return addedTransactionsFB;
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

  private plaidHandlerOnExitCallback(error: object | null, metadata: object): void {

  }

  private plaidHandlerOnLoadCallback(): void {

  }

  private plaidHandlerOnEventCallback(eventName: string, metadata: object): void {

  }
}
