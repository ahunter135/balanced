import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import {
  User,
  Transaction,
  Category,
  Subcategory,
} from 'src/app/types/firestore/user';
import { SubcategoryRepositoryService } from 'src/app/repositories/subcategory-repository.service';
import { dateTransactionSort } from 'src/app/helpers/sorters/user-related-sorters';
import { AlertService } from 'src/app/services/alert.service';
import { TransactionSorterComponent } from '../transaction-sorter/transaction-sorter.component';
import { TransactionPublisherService } from 'src/app/services/transaction-publisher.service';

@Component({
  selector: 'app-view-sub-category',
  templateUrl: './view-sub-category.component.html',
  styleUrls: ['./view-sub-category.component.scss'],
})
export class ViewSubCategoryComponent implements OnInit {
  subcategory: Subcategory;
  category: Category;
  transactions: Array<Transaction>;
  user: User | undefined;

  planned_amount: any;
  subcategoryEditName?: string;

  constructor(
    public modalController: ModalController,
    private subCategoryRepository: SubcategoryRepositoryService,
    private alertService: AlertService,
    private transactionPublisher: TransactionPublisherService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.subcategoryEditName = this.subcategory.text;
    if (this.category.id === 'income') {
      this.planned_amount = -1 * this.subcategory.planned_amount;
    } else {
      this.planned_amount = this.subcategory.planned_amount;
    }
    this.transactions = this.transactions.filter((transaction) => {
      return transaction.subcategoryId === this.subcategory.id;
    });
    this.transactions.sort(dateTransactionSort);
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

  async saveNewName() {
    if (!this.user || !this.user.id) return;
    if (this.category.id === undefined) return;
    if (
      this.subcategoryEditName == undefined ||
      this.subcategoryEditName == ''
    ) {
      this.alertService.createAndShowToast('Please enter a valid name');
      this.subcategoryEditName = this.subcategory.text;
      return;
    }
    this.subCategoryRepository.update(
      this.user.id,
      this.category.id!,
      this.subcategory.id!,
      {
        text: this.subcategoryEditName,
      }
    );
    this.subcategory.text = this.subcategoryEditName;
  }

  async deleteTransaction(item: Transaction) {
    const alrt = await this.alertCtrl.create({
      message: 'Are You Sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            this.transactions.splice(this.transactions.indexOf(item), 1);
            this.transactionPublisher.publishEvent({
              from: 'manual',
              addedTransactions: [],
              modifiedTransactions: [],
              removedTransactions: [item],
            });
          },
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    alrt.present();
  }

  async openEditTransaction(item: Transaction) {
    this.modalController.dismiss({
      transaction: item,
      action: 'edit',
    });
  }
}
