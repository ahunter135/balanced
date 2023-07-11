import { Category } from './category';

export interface User {
  email: string;
  uid: string;
  name: string;
  subscribed: boolean;
  categories: Array<Category>;
  transaction_sync_cursor: string;
}
