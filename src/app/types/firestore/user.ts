import { FirestoreDocument } from "./doc-data";

export type User = FirestoreDocument & {
  email: string;
  name: string;
  subscribed: boolean;
  categories: Array<Category>;
}

export type Subcategory = FirestoreDocument & {
  text: string;
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

export type Category = FirestoreDocument & {
  text: string;
  index: number;
  subcategories: Array<Subcategory>;
  editable: boolean;
}
