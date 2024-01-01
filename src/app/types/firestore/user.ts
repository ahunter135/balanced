import { NumberMonthYear } from "../dates/dates";
import { FirestoreDocument } from "./doc-data";

export type User = FirestoreDocument & {
  email: string;
  name: string;
  subscribed: boolean;
  categories?: Array<Category>; // optional because these may or may not be attached to the user at all times
}

export type Category = FirestoreDocument & {
  index: number;
  subcategories?: Array<Subcategory>; // optional may not be attached at all times
  editable: boolean;
}

export type Subcategory = FirestoreDocument & {
  text: string;
  date: NumberMonthYear,
  index: number;
  planned_amount: number;
  actual_amount: number;
  isEditing: boolean;
}

export type Transaction = FirestoreDocument & {
  amount: number;
  category: string;
  date: Date;
  name: string;
  merchant_name: string;
  pending: boolean;
}

export type LinkedAccount = FirestoreDocument & {
  access_token: string;
  institution: string;
  institution_name: string;
  last_transaction_retrieval: Date;
  transaction_sync_cursor: string;
}
