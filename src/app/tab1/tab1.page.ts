import { Component, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
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
  plannedIncome: number = 0;
  leftToBudget: number = 0;
  remainingToSpend: number = 0;
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
      console.log(categories);
      this.user = userDoc.data() as User;
      this.user.categories = categories;
      console.log('HERE');
      // Store the user in the service for use throughout the app
      this.userService.setActiveUser(this.user);
      this.calculatePlannedAndBudget(categories);
    }
  }

  calculatePlannedAndBudget(categories: Array<any>) {
    let total = 0;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].text == 'income') {
        for (let j = 0; j < categories[i].subcategories.length; j++) {
          total += parseInt(categories[i].subcategories[j].planned_amount);
        }
      }
    }

    this.plannedIncome = total;
    total = 0;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].text != 'income') {
        for (let j = 0; j < categories[i].subcategories.length; j++) {
          total += parseInt(categories[i].subcategories[j].planned_amount);
        }
      }
    }
    this.leftToBudget = this.plannedIncome - total;

    total = 0;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].text != 'income') {
        for (let j = 0; j < categories[i].subcategories.length; j++) {
          total += parseInt(categories[i].subcategories[j].actual_amount);
        }
      }
    }
    this.remainingToSpend = this.plannedIncome - total;
  }

  /**
   * When user clicks "add new category" this gets called.
   * Its used to add sub categories on each category card
   * @param isIncome - if its income, we do different logic because the income card is
   * not editable. Its permanent, so no need to store it anywhere
   * @param index - category cards are stored as an array, so need to know which was clicked
   */
  addNewSub(isIncome: boolean, index: number) {
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
    let selectedIndex = [];
    const monthNames = [
      { text: 'January', value: 1, selected: false },
      { text: 'February', value: 2, selected: false },
      { text: 'March', value: 3, selected: false },
      { text: 'April', value: 4, selected: false },
      { text: 'May', value: 5, selected: false },
      { text: 'June', value: 6, selected: false },
      { text: 'July', value: 7, selected: false },
      { text: 'August', value: 8, selected: false },
      { text: 'September', value: 9, selected: false },
      { text: 'October', value: 10, selected: false },
      { text: 'November', value: 11, selected: false },
      { text: 'December', value: 12, selected: false },
    ];

    for (let i = 0; i < monthNames.length; i++) {
      if (monthNames[i].text == this.chosenDate.month) {
        selectedIndex[0] = i;
        break;
      }
    }

    console.log(monthNames);
    // Array of years spanning from last 2 years to 2 years from now
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 2;
    const endYear = currentYear + 2;

    const years = [];
    let index = 0;
    for (let year = startYear; year <= endYear; year++) {
      years.push({
        text: year.toString(),
        value: year,
        selected: false,
      });
      if (year.toString() == this.chosenDate.year) {
        selectedIndex[1] = index;
      }
      index++;
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
    picker.columns[0].selectedIndex = selectedIndex[0];
    picker.columns[1].selectedIndex = selectedIndex[1];
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

  async subcategorySelected(ev: any, isIncome = false) {
    const modal = await this.modalCtrl.create({
      component: ViewSubCategoryComponent,
      componentProps: {
        subcategory: ev.sub,
        isIncome,
        category: ev.cat,
      },
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.8, 1],
    });

    modal.onDidDismiss().then(() => {
      this.calculatePlannedAndBudget(this.user.categories);
    });
    modal.present();
  }

  formatCurrency(
    number: number,
    currencyCode: string = 'USD',
    locale: string = 'en-US'
  ): string {
    // Use Intl.NumberFormat to format the number as currency
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(number);
  }

  getLeftToBudget() {
    const amount = this.leftToBudget / 100;

    if (amount < 0) {
      return `<span class='over-budget'>${this.formatCurrency(
        -1 * amount
      )}</span> over budget`;
    } else {
      return `<span class='on-budget'>${this.formatCurrency(
        amount
      )}</span> left to budget`;
    }
  }
}
