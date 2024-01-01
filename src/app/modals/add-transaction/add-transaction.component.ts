import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import {
  Transaction,
  Category,
  User,
  Subcategory,
} from 'src/app/types/firestore/user';
import { FormControl, FormGroup } from '@angular/forms';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
import { UserRepositoryService } from 'src/app/repositories/user-repository.service';
import { CategoryRepositoryService } from 'src/app/repositories/category-repository.service';
import { SubcategoryRepositoryService } from 'src/app/repositories/subcategory-repository.service';
import { generateRandomId } from 'src/app/utils/generation';
@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent implements OnInit {
  newTransactionForm: FormGroup;
  newTransaction: Transaction = {
    date: new Date(),
    id: generateRandomId(),
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
    private transactionRepository: TransactionsRepositoryService,
    private userRepository: UserRepositoryService,
    private categoryRepository: CategoryRepositoryService,
    private subcategoryRepository: SubcategoryRepositoryService,
  ) {
    this.newTransactionForm = new FormGroup({
      amount: new FormControl(this.newTransaction.amount),
    });
    this.setupModal();
  }

  ngOnInit() {}

  async setupModal() {
    this.presentingElement = await this.modalCtrl.getTop();

    // Get Budget Categories
    const user = await this.userRepository.getCurrentFirestoreUser();
    if (!user) return; /* Should handle these guards better */
    this.user = user;
    /* Grab the user's categories and subcategories */
    const categories = await this.categoryRepository.getAllFromParent(user.id!);
    if (!categories) return;
    this.categories = categories.docs.map((doc) => doc as Category);
    for (let i = 0; i < this.categories.length; i++) {
      const subcategories = await this.subcategoryRepository.getAllFromParent(
        user.id!,
        this.categories[i].id!
      );
      if (!subcategories) {
        this.categories[i].subcategories = [];
        continue;
      }
      this.categories[i].subcategories = subcategories.docs.map(
        (doc) => doc as Subcategory
      );
    }
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
      this.transactionRepository.add(this.user.id!, this.newTransaction, this.newTransaction.id);
    } catch (error) {
      console.log(error);
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
