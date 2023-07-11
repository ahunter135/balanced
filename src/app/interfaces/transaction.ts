import { Timestamp } from '@angular/fire/firestore';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: Timestamp;
  location: string;
  name: string;
  merchant_name: string;
  pending: boolean;
}
