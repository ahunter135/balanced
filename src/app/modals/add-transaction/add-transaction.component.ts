import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Transaction } from 'src/app/interfaces/transaction';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/interfaces/category';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';
import { doc, getFirestore, setDoc } from '@angular/fire/firestore';
import { v4 as uuid } from 'uuid';
@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
  newTransactionForm: FormGroup;
  newTransaction: Transaction = {
    date: new Date(),
    id: uuid(),
    amount: 0,
    category: '',
    name: '',
    merchant_name: '',
    pending: false,
  };
  transactionType: string = 'expense';
  presentingElement: any;
  categories = [] as Array<Category>;
  user: User;
  selectedSub: string;
  constructor(
    public modalCtrl: ModalController,
    private userService: UserService
  ) {
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
    this.user = this.userService.getActiveUser() as User;
  }
  amountChanged(event: number) {
    this.newTransaction['amount'] = event;
  }

  add() {
    let newTransactionObject = Object.assign({}, this.newTransaction);
    if (this.transactionType == 'income') {
      newTransactionObject.amount = -1 * newTransactionObject.amount;
    }
    try {
      setDoc(
        doc(
          getFirestore(),
          'users',
          this.user.uid,
          'transactions',
          newTransactionObject.id
        ),
        { ...newTransactionObject }
      );
    } catch (error) {
    } finally {
      this.modalCtrl.dismiss();
    }
  }

  subcategorySelected(ev: any) {
    this.modalCtrl.dismiss();
    console.log(ev);
    this.selectedSub = ev.text;
    this.newTransaction.category = ev.id;
    this.newTransaction.pending = false;
  }
}
