import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LinkedAccountsRepositoryService } from '../repositories/linked-accounts-repository.service';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { Transaction } from '../types/firestore/user';
import { forkJoin, lastValueFrom } from 'rxjs';
import { dateTransactionSort } from '../helpers/sorters/user-related-sorters';
import { TransactionsRepositoryService } from '../repositories/transactions-repository.service';
import { GET_TRANSACTION_DATA_URL } from '../constants/http/urls';
import { PlaidTransaction } from '../types/plaid/plaid';
import { plaidTransactionToFirestoreTransaction } from '../helpers/mappers/transactions';

@Injectable({
  providedIn: 'root'
})
export class PlaidService {

  constructor(
    private http: HttpService,
    private linkedAccountsRepository: LinkedAccountsRepositoryService,
    private transactionRepository: TransactionsRepositoryService,
    private userRepository: UserRepositoryService,
  ) { }


  async getTransactionsFromPlaid(): Promise<Transaction[]> {
    let transactions: PlaidTransaction[] = [];

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
            GET_TRANSACTION_DATA_URL, // TODO: Change this to the real URL
            {
              accessToken: linkedAccount.access_token,
              cursor: linkedAccount.transaction_sync_cursor,
            }
          )
        )
      );
    }

    /* Step 3: Get the transactions from http responses */
    forkJoin(promises).subscribe((responses) => {
      responses.forEach((resp, index) => {
        const linkedAccount = linkedAccounts[index]; /* TODO: Make sure this is the right index */
        const newTransactions: PlaidTransaction[] = resp.added;
        newTransactions.sort(dateTransactionSort);
        /* TODO: Remove old transactions? */
        transactions = transactions.concat(newTransactions);
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
    const mappedTransactions = transactions.map(plaidTransactionToFirestoreTransaction);
    /* Add new transactions to the database */
    mappedTransactions.forEach(async (t) => {
      this.transactionRepository.add(this.userRepository.getCurrentUserId()!, t);
    });
    return mappedTransactions;
  }
}
