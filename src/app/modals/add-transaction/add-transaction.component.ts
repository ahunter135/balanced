import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import {
  Transaction,
  Category,
  User,
} from 'src/app/types/firestore/user';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { doc, getFirestore, setDoc } from '@angular/fire/firestore';
import { v4 as uuid } from 'uuid';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
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
  presentingElement: any;
  categories = [] as Array<Category>;
  user: User;

  constructor(
    public modalCtrl: ModalController,
    private userService: UserService,
    private transactionRepository: TransactionsRepositoryService,
  ) {
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
    try {
      this.transactionRepository.add(this.user.id!, this.newTransaction, this.newTransaction.id);
    } catch (error) {
      this.modalCtrl.dismiss();
    }
  }
}
