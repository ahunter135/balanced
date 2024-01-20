import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  User,
  Transaction,
  Category,
} from 'src/app/types/firestore/user';
import { FormGroup } from '@angular/forms';
import { IonDatetime, ModalController } from '@ionic/angular';
import { TransactionPublisherService } from 'src/app/services/transaction-publisher.service';

@Component({
  selector: 'app-transaction-sorter',
  templateUrl: './transaction-sorter.component.html',
  styleUrls: ['./transaction-sorter.component.scss'],
})
export class TransactionSorterComponent implements AfterViewInit {
  @ViewChild(IonDatetime) ionDatetime: IonDatetime;

  newTransactionForm: FormGroup;
  presentingElement: any;
  isIncome: boolean;

  /* Component props */
  transaction: Transaction;
  categories: Array<Category>;
  user: User | undefined;

  /* Make income positive for user input */
  transactionAmountUserView: number;

  selectedSub: string;

  constructor(
    public modalCtrl: ModalController,
    private transactionPublisher: TransactionPublisherService,
  ) {
    this.transactionAmountUserView = 0;
  }

  async ngOnInit() {
    this.isIncome = this.transaction.amount < 0;
    this.transactionAmountUserView = this.getAmount();
  }

  async ngAfterViewInit() {
    const off = this.transaction.date.getTimezoneOffset();
    const date = new Date(this.transaction.date.getTime() - (off * 60 * 1000));
    /* Cheat by putting into local time but spoofing as UTC to get format */
    this.ionDatetime.value = date.toISOString();
  }

  async save() {
    /* Set back to negative if income */
    if (this.isIncome) {
      this.transaction.amount = -this.transactionAmountUserView;
    } else {
      this.transaction.amount = this.transactionAmountUserView;
    }
    console.log(this.transaction);
    this.transactionPublisher.publishEvent({
      from: 'manual',
      addedTransactions: [],
      modifiedTransactions: [this.transaction],
      removedTransactions: [],
    });
    this.modalCtrl.dismiss();
  }

  subcategorySelected(ev: any, cat: Category) {
    this.modalCtrl.dismiss();
    this.transaction.subcategoryId = ev.id;
    /* If new category is income, we need to set amount < 0 */
    this.isIncome = cat.id === 'income';
  }

  dateChanged(ev: any) {
    this.transaction.date = new Date(ev.detail.value);
  }

  getAmount() {
    return this.transaction.amount >= 0 ?
      this.transaction.amount :
      -this.transaction.amount;
  }
}
