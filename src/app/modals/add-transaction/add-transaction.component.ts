import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  Transaction,
  Category,
  User,
  Subcategory,
} from 'src/app/types/firestore/user';
import { FormControl, FormGroup } from '@angular/forms';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
import { generateRandomId } from 'src/app/utils/generation';
import { AlertService } from 'src/app/services/alert.service';
import { SubcategoryRepositoryService } from 'src/app/repositories/subcategory-repository.service';
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
    private transactionRepository: TransactionsRepositoryService,
    private subcategoryRepository: SubcategoryRepositoryService,
    private alertService: AlertService,
    private transactionPublisher: TransactionPublisherService,
  ) {
    this.newTransactionForm = new FormGroup({
      amount: new FormControl(this.newTransaction.amount),
    });
    this.setupModal();
  }

  ngOnInit() {}

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
      /** Adds the transaction to the database
        * and updates the subcategory actual_amount
        * atomically
        */
      if (!(await this.subcategoryRepository.updateActualAmountAtomic(
        this.user.id!,
        this.selectedCat.id!,
        this.selectedSub.id!,
        newTransactionObject.amount,
      ))) {
        throw new Error('Error updating subcategory actual_amount');
      }
      this.transactionRepository.add(this.user.id!, newTransactionObject, newTransactionObject.id!);
      this.transactionPublisher.publishEvent({
        addedTransactions: [newTransactionObject],
        removedTransactions: [],
        modifiedTransactions: [],
      });
    } catch (error) {
      console.log(error);
    }
    this.modalCtrl.dismiss();
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
