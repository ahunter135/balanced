import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Transaction } from 'src/app/interfaces/transaction';
import { FormGroup } from '@angular/forms';
import { Category } from 'src/app/interfaces/category';
import { v4 as uuid } from 'uuid';
import { ModalController, NavParams } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { doc, getFirestore, updateDoc } from '@angular/fire/firestore';
@Component({
  selector: 'app-transaction-sorter',
  templateUrl: './transaction-sorter.component.html',
  styleUrls: ['./transaction-sorter.component.scss'],
})
export class TransactionSorterComponent implements OnInit {
  newTransactionForm: FormGroup;
  newTransaction: Transaction;
  presentingElement: any;
  categories = [] as Array<Category>;
  user: User;
  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.newTransaction = this.navParams.get('transaction');
    console.log(this.newTransaction);
    // Get Budget Categories
    this.user = this.userService.getActiveUser() as User;
  }

  async save() {
    await updateDoc(
      doc(
        getFirestore(),
        'users',
        this.user.uid as string,
        'transactions',
        this.newTransaction.id
      ),
      {
        ...this.newTransaction,
      }
    );
    const pendingTransactions = this.userService.getPendingTransactions();
    for (let i = 0; i < pendingTransactions.length; i++) {
      if (pendingTransactions[i].id === this.newTransaction.id) {
        pendingTransactions.splice(i, 1);
        break;
      }
    }
    this.userService.setPendingTransactions(pendingTransactions);
    this.modalCtrl.dismiss();
  }

  subcategorySelected(ev: any) {
    this.modalCtrl.dismiss();
    this.newTransaction.category = ev.id;
    this.newTransaction.pending = false;
  }
}
