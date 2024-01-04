import { Transaction } from 'src/app/types/firestore/user';
import { PlaidTransaction } from 'src/app/types/plaid/plaid';

export function plaidTransactionToFirestoreTransaction(
  plaidTransaction: PlaidTransaction
): Transaction {
  const date = plaidTransaction.datetime ?
    new Date(plaidTransaction.datetime) :
    new Date(plaidTransaction.date);
  return {
    id: plaidTransaction.transaction_id,
    amount: plaidTransaction.amount,
    subcategoryId: '',
    date,
    merchant_name: plaidTransaction.merchant_name,
    name: plaidTransaction.name,
    pending: plaidTransaction.pending,
  }
}
