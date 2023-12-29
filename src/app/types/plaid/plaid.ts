export type PlaidTransaction = {
  transaction_id: string;
  amount: number;
  date: Date; /* TODO: Figure out format */
  name: string;
  merchant_name: string;
  pending: boolean;
}
