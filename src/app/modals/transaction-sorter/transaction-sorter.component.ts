import { Component, OnInit } from '@angular/core';
import {
  User,
  Transaction,
  Category,
} from 'src/app/types/firestore/user';
import { FormGroup } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
import { CategoryRepositoryService } from 'src/app/repositories/category-repository.service';
import { SubcategoryRepositoryService } from 'src/app/repositories/subcategory-repository.service';
import { UserRepositoryService } from 'src/app/repositories/user-repository.service';
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
  user: User | undefined;

  selectedSub: string;
  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private transactionRepository: TransactionsRepositoryService,
    private categoryRepository: CategoryRepositoryService,
    private subcategoryRepository: SubcategoryRepositoryService,
    private userRepository: UserRepositoryService,
  ) {}

  async ngOnInit() {
    this.newTransaction = this.navParams.get('transaction');
    console.log(this.newTransaction);
    // Get Budget Categories
    this.user = await this.userRepository.getCurrentFirestoreUser();
    if (!this.user) return; /* Should handle these guards better */

    this.categories = (await this.categoryRepository.getAllFromParent(this.user.id!)).docs;
    for (let i = 0; i < this.categories.length; i++) {
      this.categories[i].subcategories = (await this.subcategoryRepository.getAllFromParent(this.user.id!, this.categories[i].id!)).docs;
    }
  }

  async save() {
    if (!this.user || !this.user.id) return;
    // Update the transaction doc
    await this.transactionRepository.update(this.user.id!, this.newTransaction.id!, this.newTransaction);
    const subcategoryId = this.newTransaction.category;

    // Update the subcategory actual_amount
    for (let i = 0; i < this.categories.length; i++) {
      if (!this.categories[i].subcategories) continue;
      for (let j = 0; j < this.categories[i].subcategories!.length; j++) {
        if (
          this.categories[i].subcategories![j].id ==
          this.newTransaction.category
        ) {
          this.subcategoryRepository.update(
            this.user.id,
            this.categories[i].id!,
            subcategoryId,
            {
              actual_amount:
                this.categories[i].subcategories![j].actual_amount +
                this.newTransaction.amount,
            }
          );
          break;
        }
      }
    }

    // Update the local pendingTransactions array
    /* TODO: Split this into a subscriber/publisher pattern
    const pendingTransactions = this.userService.getPendingTransactions();
    for (let i = 0; i < pendingTransactions.length; i++) {
      if (pendingTransactions[i].id === this.newTransaction.id) {
        pendingTransactions.splice(i, 1);
        break;
      }
    }
    this.userService.setPendingTransactions(pendingTransactions);
    */
    this.modalCtrl.dismiss();
  }

  subcategorySelected(ev: any) {
    this.modalCtrl.dismiss();
    console.log(ev);
    this.selectedSub = ev.text;
    this.newTransaction.category = ev.id;
    this.newTransaction.pending = false;
  }

  getAmount() {
    return (this.newTransaction.amount / 100) * -1;
  }
}
