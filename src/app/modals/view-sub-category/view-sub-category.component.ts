import { Component, OnInit } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ModalController, NavParams } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';
import { Subcategory } from 'src/app/interfaces/subcategory';
import { Transaction } from 'src/app/interfaces/transaction';
import { User } from 'src/app/interfaces/user';
import { UserRepositoryService } from 'src/app/repositories/user-repository.service';
import { UserService } from 'src/app/services/user.service';

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
  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private userService: UserService,
    private userRepository: UserRepositoryService,
  ) {}

  ngOnInit() {
    this.subcategory = this.navParams.get('subcategory');
    this.category = this.navParams.get('category');

    this.getData();
  }

  async getData() {
    this.transactions = [];
    let transactionsSnapshot = await getDocs(
      query(
        collection(
          getFirestore(),
          'users',
          (await this.userRepository.getCurrentFirestoreUser())?.uid as string,
          'transactions'
        ),
        where('category', '==', this.subcategory.id)
      )
    );

    transactionsSnapshot.forEach((element) => {
      this.transactions.push(element.data() as Transaction);
    });
  }

  async saveNewAmount() {
    this.user = this.userService.activeUser;
    if (!this.user) {
      return;
    }
    for (let i = 0; i < this.user.categories.length; i++) {
      if (this.user.categories[i].id == this.category.id) {
        for (let j = 0; j < this.user.categories[i].subcategories.length; j++) {
          if (
            this.user.categories[i].subcategories[j].id == this.subcategory.id
          ) {
            this.user.categories[i].subcategories[j].planned_amount =
              this.subcategory.planned_amount * 100;
            break;
          }
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
  }

  parseAmount(amount: number) {
    return amount * -1;
  }
}
