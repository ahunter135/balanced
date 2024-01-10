import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  Transaction,
  Category,
  User,
  Subcategory,
} from 'src/app/types/firestore/user';
import { FormControl, FormGroup } from '@angular/forms';
import { generateRandomId } from 'src/app/utils/generation';
import { AlertService } from 'src/app/services/alert.service';
import { TransactionPublisherService } from 'src/app/services/transaction-publisher.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
  @Input() categories: Array<Category>;
  /* User may or may not have their categories attached */
  @Input() user: User;

  newTransactionForm: FormGroup;
  newTransaction: Transaction = {
    date: new Date(),
    id: generateRandomId(),
    amount: 0,
    subcategoryId: '',
    name: '',
    merchant_name: '',
    pending: false,
  };
  presentingElement: any;
  selectedSub: Subcategory;
  selectedCat: Category;

  constructor(
    public modalCtrl: ModalController,
    private alertService: AlertService,
    private transactionPublisher: TransactionPublisherService,
  ) {
    this.newTransactionForm = new FormGroup({
      amount: new FormControl(this.newTransaction.amount),
    });
    this.setupModal();
  }

  ngOnInit() {
  }

  async setupModal() {
    this.presentingElement = await this.modalCtrl.getTop();
  }

  async add() {
    if (!this.newTransaction.amount ||
        this.newTransaction.amount == 0) {
      this.alertService.createAndShowToast('Please enter an amount');
      return;
    }
    let newTransactionObject: Transaction = Object.assign({}, this.newTransaction);
    if (this.selectedCat.id == 'income') {
      newTransactionObject.amount = -1 * newTransactionObject.amount;
    }
    try {
      this.transactionPublisher.publishEvent({
        from: 'manual',
        addedTransactions: [newTransactionObject],
        removedTransactions: [],
        modifiedTransactions: [],
        other: {
          subcategoryId: this.selectedSub.id!,
          categoryId: this.selectedCat.id!,
        },
      });
    } catch (error) {
      console.log(error);
    }
    this.modalCtrl.dismiss();
  }

  dateChanged(ev: any) {
    const date = ev.detail.value;
    this.newTransaction.date = new Date(date);
    console.log(this.newTransaction.date);
  }

  subcategorySelected(ev: any, cat: Category) {
    this.modalCtrl.dismiss();
    console.log(ev);
    this.selectedSub = ev;
    this.selectedCat = cat;
    this.newTransaction.subcategoryId = ev.id;
    this.newTransaction.pending = false;
  }
}
