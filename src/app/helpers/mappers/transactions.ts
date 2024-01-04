import { Transaction } from 'src/app/types/firestore/user';
import { PlaidTransaction } from 'src/app/types/plaid/plaid';

export function plaidTransactionToFirestoreTransaction(
  plaidTransaction: PlaidTransaction
): Transaction {
  return {
    id: plaidTransaction.transaction_id,
    amount: plaidTransaction.amount,
    subcategoryId: '',
    date: new Date(plaidTransaction.datetime),
    merchant_name: plaidTransaction.merchant_name,
    name: plaidTransaction.name,
    pending: plaidTransaction.pending,
  }
}
