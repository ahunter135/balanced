import { Component, OnInit } from '@angular/core';
import {
  User,
  Transaction,
  Category,
} from 'src/app/types/firestore/user';
import { FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { doc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryRepositoryService } from 'src/app/repositories/category-repository.service';
import { SubcategoryRepositoryService } from 'src/app/repositories/subcategory-repository.service';
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
    private authService: AuthService,
    private userService: UserService,
    private navParams: NavParams,
    private transactionRepository: TransactionsRepositoryService,
    private categoryRepository: CategoryRepositoryService,
    private subcategoryRepository: SubcategoryRepositoryService,
  ) {}

  async ngOnInit() {
    this.newTransaction = this.navParams.get('transaction');
    console.log(this.newTransaction);
    // Get Budget Categories
    this.user = (await this.authService.getCurrentFirestoreUser()) as User;
    this.user.categories = [];
    this.user.categories = (await this.categoryRepository.getAllFromParent(this.user.id!)).docs;
    // TODO: REFACTOR THIS TO MATCH NEW DATA
    let promises = [];
    for (let i = 0; i < this.user.categories.length; i++) {
      this.user.categories[i].subcategories = [];
      promises.push(
        this.subcategoryRepository.getAllFromParent(this.user.id!, this.user.categories[i].id!).then((subcategories) => {
          this.user.categories![i].subcategories = subcategories.docs;
        })
      );
    }
  }

  async save() {
    // Update the transaction doc
    await this.transactionRepository.update(this.user.id!, this.newTransaction.id!, this.newTransaction);
    const category = this.newTransaction.category;

    // Update the subcategory actual_amount
    for (let i = 0; i < this.user.categories.length; i++) {
      for (let j = 0; j < this.user.categories[i].subcategories.length; j++) {
        if (
          this.user.categories[i].subcategories[j].id ==
          this.newTransaction.category
        ) {
          this.user.categories[i].subcategories[j].actual_amount +=
            this.newTransaction.amount;
          break;
        }
      }
    }
    updateDoc(
      doc(
        getFirestore(),
        'users',
        this.userService.getActiveUser()?.uid as string
      ),
      {
        categories: this.user.categories,
      }
    );
    // Update the local pendingTransactions array
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
