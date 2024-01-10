import { Injectable } from '@angular/core';
import { PlaidService } from './plaid.service';
import { TransactionsRepositoryService } from '../repositories/transactions-repository.service';
import { Transaction } from '../types/firestore/user';
import { buildTransactionsQuery } from '../helpers/queries/transactions';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { ITransactionSubscriber, TransactionEvent } from './interfaces/transaction-publisher';
import { TransactionPublisherService } from './transaction-publisher.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService implements ITransactionSubscriber {

  constructor(
    private plaidService: PlaidService,
    private transactionRepository: TransactionsRepositoryService,
    private userRepository: UserRepositoryService,
    private transactionPublisher: TransactionPublisherService,
  ) {
    this.transactionPublisher.subscribe(this);
  }

  /* Function to get transactions from the database based on
  *  common parameters.
  * @param includePending Whether to include pending transactions.
  * @param includeNonPending Whether to include non-pending transactions.
  * @param syncPlaid Whether to sync transactions from Plaid.
  * @param startDate The start date of the range to get transactions from.
  * @param endDate The end date of the range to get transactions from.
  * @returns An array of transactions.
  */
  async getTransactions(
    includePending: boolean,
    syncPlaid: boolean = true,
    startDate: Date | null = null,
    endDate: Date | null = null,
  ): Promise<Transaction[]> {
    const userId = this.userRepository.getCurrentUserId();
    if (!userId) throw new Error('User is not logged in');

    let transactions: Transaction[] = [];
    const query = buildTransactionsQuery(
      userId,
      includePending,
      startDate,
      endDate,
    );
    transactions = (await this.transactionRepository.getByQuery(query)).docs;
    if (syncPlaid) {
      /* This will send new transactions through event
       * wait until transactions fetched from db to avoid duplicates
       */
      this.plaidService.syncPlaidTransactions();
    }

    return transactions;
  }

  /** When a transaction event occurs, this function will be responsible
    * for updating the database with the new transaction. It will also
    * update the subcategory's actual amounts.
    * @param event The transaction event that occurred.
    */
  async onTransactionEvent(event: TransactionEvent): Promise<void> {
    /* Handle added transactions */
    event.addedTransactions.forEach(async (t) => {
      this.transactionRepository.add(
        this.userRepository.getCurrentUserId()!,
        t,
        t.id!,
      );
    });

    /* Handle removed transactions */
    event.removedTransactions.forEach(async (t) => {
      this.transactionRepository.delete(
        this.userRepository.getCurrentUserId()!,
        t.id!,
        true,
      );
    });

    /* Handle modified transactions */
    event.modifiedTransactions.forEach(async (t) => {
      this.transactionRepository.update(
        this.userRepository.getCurrentUserId()!,
        t.id!,
        t,
      );
    });
  }
}
