import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Transaction } from 'src/app/interfaces/transaction';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
  newTransactionForm: FormGroup;
  newTransaction: Transaction = {
    date: new Date(),
    id: '',
    amount: 0,
    category: '',
    location: '',
    name: '',
    merchant_name: '',
    pending: false,
  };
  presentingElement: any;
  categories = [] as Array<Category>;
  constructor(public modalCtrl: ModalController) {
    console.log(this.newTransaction);
    this.newTransaction.date = new Date();
    this.newTransactionForm = new FormGroup({
      amount: new FormControl(this.newTransaction.amount),
    });
    this.setupModal(); // need await
  }

  ngOnInit() {}

  async setupModal() {
    this.presentingElement = await this.modalCtrl.getTop();

    // Get Budget Categories
  }
  amountChanged(event: number) {
    this.newTransaction['amount'] = event;
  }
}
