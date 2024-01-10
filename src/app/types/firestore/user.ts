import { NumberMonthYear } from "../dates/dates";
import { FirestoreDocument } from "./doc-data";

export type User = FirestoreDocument & {
  email: string;
  name: string;
  subscribed: boolean;
  categories?: Array<Category>; // optional because these may or may not be attached to the user at all times
}

/* Subcollection of User */
export type Category = FirestoreDocument & {
  index: number;
  subcategories?: Array<Subcategory>; // optional may not be attached at all times
  editable: boolean;
}

/* Subcollection of Category */
export type Subcategory = FirestoreDocument & {
  text: string;
  date: NumberMonthYear,
  index: number;
  planned_amount: number;
  actual_amount: number;
  isEditing: boolean;
}

/* Subcollection of User */
export type Transaction = FirestoreDocument & {
  amount: number;
  subcategoryId: string;
  date: Date;
  name: string;
  merchant_name: string;
  pending: boolean;
}

/* Subcollection of User */
export type LinkedAccount = FirestoreDocument & {
  institution: string;
  institution_name: string;
  last_transaction_retrieval: Date;
  transaction_sync_cursor: string;
}
