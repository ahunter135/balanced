import { Category, Transaction } from "src/app/types/firestore/user";
import { PlaidTransaction } from "src/app/types/plaid/plaid";

export function defaultCategorySort(a: Category, b: Category) {
  if (a.index > b.index) {
    return 1;
  } else if (a.index < b.index) {
    return -1;
  } else {
    return 0;
  }
}

export function dateTransactionSort(a: Transaction | PlaidTransaction, b: Transaction | PlaidTransaction) {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB.getTime() - dateA.getTime();
}
