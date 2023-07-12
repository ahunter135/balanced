import { Component } from '@angular/core';
import { getFirestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { Category } from '../interfaces/category';
import { UserService } from '../services/user.service';
import { Subcategory } from '../interfaces/subcategory';
import { v4 as uuid } from 'uuid';
import { ModalController, PickerController } from '@ionic/angular';
import { TransactionSorterComponent } from '../modals/transaction-sorter/transaction-sorter.component';
import { ViewSubCategoryComponent } from '../modals/view-sub-category/view-sub-category.component';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  user = {} as User;
  institutionName = '';
  transactions = [] as any;
  currentView: string = 'budgeted';
  chosenDate = {
    month: '',
    year: '',
  };
  isCardContainerVisible: boolean = false;

  constructor(
    public userService: UserService,
    private pickerCtrl: PickerController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    // Set the app to load the current month
    this.chosenDate.month = new Date().toLocaleString('default', {
      month: 'long',
    });
    this.chosenDate.year = new Date().getFullYear().toString();

    this.getUserData().then(() => {
      // User data has been grabbed
      // Lets get their transactions that need to be budgeted
      this.userService.getUserTransactionsFromPlaid(this.user);
    });
  }

  /**
   * Grab the logged in user from the DB
   */
  async getUserData() {
    let userDoc = await getDoc(
      doc(
        getFirestore(),
        'users',
        this.userService.getActiveUser()?.uid as string
      )
    );

    if (userDoc.exists()) {
      // Get the budget card items and sort them based on desired index.
      // User will be able to organize their cards how they want
      const categories = userDoc.data()['categories'];
      categories.sort((a: Category, b: Category) => {
        if (a.index > b.index) {
          return 1;
        } else if (a.index < b.index) {
          return -1;
        } else {
          return 0;
        }
      });
      this.user = userDoc.data() as User;
      this.user.categories = categories;

      // Store the user in the service for use throughout the app
      this.userService.setActiveUser(this.user);
    }
  }

  /**
   * When user clicks "add new category" this gets called.
   * Its used to add sub categories on each category card
   * @param isIncome - if its income, we do different logic because the income card is
   * not editable. Its permanent, so no need to store it anywhere
   * @param index - category cards are stored as an array, so need to know which was clicked
   */
  addNewSub(isIncome: boolean, index: number) {
    if (isIncome) {
    } else {
      const newSub: Subcategory = {
        text: '',
        index: this.user.categories[index].subcategories.length,
        planned_amount: 0,
        actual_amount: 0,
        id: uuid(),
        isEditing: true,
      };

      this.user.categories[index].subcategories = [
        ...this.user.categories[index].subcategories,
        newSub,
      ];
    }
  }

  /**
   * Sub category was added, save to DB
   */
  async saveAllSubs() {
    updateDoc(doc(getFirestore(), 'users', this.user.uid as string), {
      categories: [...this.user.categories],
    });
  }

  /**
   * If segment is changed in header, change view
   * @param ev - emitted from Header
   */
  viewChanged(ev: any) {
    this.currentView = ev;
  }

  /**
   * Emitted from Header when a transaction gets pushed to DB. So lets refresh the users data
   */
  async transactionAdded() {
    this.getUserData();
  }

  /**
   * Emitted from Header, shows a date picker to change the budget date
   */
  async requestDateChange() {
    // Array of month names
    const monthNames = [
      { text: 'January', value: 1 },
      { text: 'February', value: 2 },
      { text: 'March', value: 3 },
      { text: 'April', value: 4 },
      { text: 'May', value: 5 },
      { text: 'June', value: 6 },
      { text: 'July', value: 7 },
      { text: 'August', value: 8 },
      { text: 'September', value: 9 },
      { text: 'October', value: 10 },
      { text: 'November', value: 11 },
      { text: 'December', value: 12 },
    ];

    // Array of years spanning from last 2 years to 2 years from now
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const endYear = currentYear + 2;

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push({ text: year.toString(), value: year });
    }

    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'month',
          options: [...monthNames],
        },
        {
          name: 'year',
          options: [...years],
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (value) => {
            this.chosenDate.month = value.month.text;
            this.chosenDate.year = value.year.value;

            // New date has been selected, grab all that months transactions
            this.getDataForNewMonth();
          },
        },
      ],
    });

    await picker.present();
  }

  /**
   * Date has been changed, so grab new data for that months budget
   */
  getDataForNewMonth() {}

  revealPendingTransactions() {
    this.isCardContainerVisible = !this.isCardContainerVisible;
  }

  parseAmount(amount: number) {
    return amount * -1;
  }

  async openTransactionSorter(index: number) {
    const modal = await this.modalCtrl.create({
      component: TransactionSorterComponent,
      componentProps: {
        transaction: this.userService.getPendingTransactions()[index],
      },
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.8, 1],
    });

    modal.present();
  }

  async subcategorySelected(ev: any) {
    const modal = await this.modalCtrl.create({
      component: ViewSubCategoryComponent,
      componentProps: {
        subcategory: ev.sub,
        category: ev.cat,
      },
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.8, 1],
    });

    modal.present();
  }
}
