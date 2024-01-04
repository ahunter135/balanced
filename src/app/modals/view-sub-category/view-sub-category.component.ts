import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { User, Transaction, Category, Subcategory } from 'src/app/types/firestore/user';
import { UserRepositoryService } from 'src/app/repositories/user-repository.service';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
import { buildTransactionsQuery } from 'src/app/helpers/queries/transactions';
import { dateTransactionSort } from 'src/app/helpers/sorters/user-related-sorters';
import { SubcategoryRepositoryService } from 'src/app/repositories/subcategory-repository.service';

@Component({
  selector: 'app-view-sub-category',
  templateUrl: './view-sub-category.component.html',
  styleUrls: ['./view-sub-category.component.scss'],
})
export class ViewSubCategoryComponent implements OnInit {
  subcategory: Subcategory;
  category: Category;
  transactions: Array<Transaction> = [];
  user: User | undefined;
  planned_amount: any;


  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private userRepository: UserRepositoryService,
    private transactionRepository: TransactionsRepositoryService,
    private subCategoryRepository: SubcategoryRepositoryService,
  ) {}

  ngOnInit() {
    this.subcategory = this.navParams.get('subcategory');
    if (this.subcategory.id === 'income') {
    }
    this.category = this.navParams.get('category');
    this.userRepository.getCurrentFirestoreUser().then(async (user) => {
      this.user = user;
      if (!user) return;
      this.transactions = await this.getTransactions();
      this.transactions.sort(dateTransactionSort);
      if (this.category.id === 'income') {
        this.planned_amount = -1 * this.subcategory.planned_amount;
      } else {
        this.planned_amount = this.subcategory.planned_amount;
      }
    });
  }

  /* IDEA: Should grab only some transactions, not all.
   * Can do this easily, but later on if want to implement
   */
  async getTransactions(): Promise<Array<Transaction>> {
    if (!this.user || !this.user.id) return [];

    const q = buildTransactionsQuery(
      this.user.id,
      true,
      true,
      null,
      null,
      this.subcategory.id
    );
    const querySnapshot = await this.transactionRepository.getByQuery(q);
    return querySnapshot.docs;
  }

  /* Save new planned amount to the database */
  async saveNewAmount() {
    if (!this.user || !this.user.id) return;
    if (this.category.id === undefined) return;
    let planned_amount = this.planned_amount;
    if (this.category.id == 'income') {
      planned_amount = -1 * this.planned_amount;
    }

    this.subCategoryRepository.update(
      this.user.id,
      this.category.id!,
      this.subcategory.id!,
      {
        planned_amount: planned_amount,
      }
    );
    /* Changing this changes Tab 1's subcategory.planned_amount */
    this.subcategory.planned_amount = planned_amount;
  }
}
