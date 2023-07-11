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
    location: '',
    name: '',
    merchant_name: '',
    pending: false,
  };
  presentingElement: any;
  categories = [] as Array<Category>;
  user: User;
  constructor(
    public modalCtrl: ModalController,
    private userService: UserService
  ) {
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
    this.user = this.userService.getActiveUser() as User;
  }
  amountChanged(event: number) {
    this.newTransaction['amount'] = event;
  }

  add() {
    setDoc(
      doc(
        getFirestore(),
        'users',
        this.user.uid,
        'transactions',
        this.newTransaction.id
      ),
      { ...this.newTransaction }
    );
  }
}
