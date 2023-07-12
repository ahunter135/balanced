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
  constructor(
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subcategory = this.navParams.get('subcategory');
    this.category = this.navParams.get('category');
    console.log(this.subcategory);
    console.log(this.category);

    this.getData();
  }

  async getData() {
    this.transactions = [];
    let transactionsSnapshot = await getDocs(
      query(
        collection(
          getFirestore(),
          'users',
          this.userService.getActiveUser()?.uid as string,
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
    let userDoc = await getDoc(
      doc(
        getFirestore(),
        'users',
        this.userService.getActiveUser()?.uid as string
      )
    );

    if (userDoc.exists()) {
      let categories: Array<Category> = userDoc.data()['categories'];
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].id == this.category.id) {
          for (let j = 0; j < categories[i].subcategories.length; j++) {
            if (categories[i].subcategories[j].id == this.subcategory.id) {
              categories[i].subcategories[j] = this.subcategory;
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
          categories,
        }
      );
    }
  }

  parseAmount(amount: number) {
    return amount * -1;
  }
}
