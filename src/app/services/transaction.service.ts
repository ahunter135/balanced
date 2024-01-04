import { Injectable } from '@angular/core';
import { PlaidService } from './plaid.service';
import { TransactionsRepositoryService } from '../repositories/transactions-repository.service';
import { Transaction } from '../types/firestore/user';
import { buildTransactionsQuery } from '../helpers/queries/transactions';
import { UserRepositoryService } from '../repositories/user-repository.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private plaidService: PlaidService,
    private transactionRepository: TransactionsRepositoryService,
    private userRepository: UserRepositoryService,
  ) { }

  /* Function to get transactions from the database based on
  *  common parameters.
  * @param pendingOnly Whether to only get pending transactions.
  * @param startDate The start date of the range to get transactions from.
  * @param endDate The end date of the range to get transactions from.
  * @param getFromPlaid Whether to get transactions from Plaid.
  * @returns An array of transactions.
  */
  async getTransactions(
    includePending: boolean,
    includeNonPending: boolean,
    getFromPlaid: boolean = false,
    startDate: Date | null = null,
    endDate: Date | null = null,
  ): Promise<Transaction[]> {
    const userId = this.userRepository.getCurrentUserId();
    if (!userId) throw new Error('User is not logged in');

    let transactions: Transaction[] = [];
    let plaidsTransactions: Transaction[] | null = null;
    if (getFromPlaid) {
      plaidsTransactions = await this.getTransactionsFromPlaid();
    }
    const query = buildTransactionsQuery(
      userId,
      includePending,
      includeNonPending,
      startDate,
      endDate,
    );
    transactions = (await this.transactionRepository.getByQuery(query)).docs;

    if (plaidsTransactions) {
      /* Filter out the transactions that don't match the query */
      plaidsTransactions = plaidsTransactions.filter((t) => {
        let isValid = true;
        if (includePending) {
          isValid = isValid && t.pending;
        }
        if (!includePending) {
          isValid = isValid && !t.pending;
        }
        if (startDate) {
          isValid = isValid && t.date >= startDate;
        }
        if (endDate) {
          isValid = isValid && t.date <= endDate;
        }
        return isValid;
      });
      transactions = transactions.concat(plaidsTransactions);
    }
    return transactions;

  }

  /* A wrapper in case we need to preprocess some */
  private async getTransactionsFromPlaid(): Promise<Transaction[]> {
    return this.plaidService.getTransactionsFromPlaid();
  }

}
