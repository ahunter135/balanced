import { Component } from '@angular/core';
import { getFirestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import {
  User,
  Category,
  Subcategory
} from 'src/app/types/firestore/user';
import { UserService } from '../services/user.service';
import { v4 as uuid } from 'uuid';
import { ModalController, PickerController } from '@ionic/angular';
import { TransactionSorterComponent } from '../modals/transaction-sorter/transaction-sorter.component';
import { ViewSubCategoryComponent } from '../modals/view-sub-category/view-sub-category.component';
import { LocaleStringMonthYear, NumberMonthYear } from '../types/dates/dates';
import { getMonthYearLocaleString, getNumberMonthYearFromDate } from '../helpers/formatters/dates';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { defaultCategorySort } from '../helpers/sorters/user-related-sorters';
import { CategoryRepositoryService } from '../repositories/category-repository.service';
import { SubcategoryRepositoryService } from '../repositories/subcategory-repository.service';
import { buildSubcategoryByDateQuery } from '../helpers/queries/subcategories';
import { MONTH_NAMES_AND_VALUES, PICKER_YEAR_NAMES_AND_VALUES } from '../constants/dates/dates';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  user?: User;
  institutionName = '';
  transactions = [] as any;
  currentView: string = 'budgeted';
  private _chosenDate: LocaleStringMonthYear;
  private _chosenDateNumber: NumberMonthYear;
  isCardContainerVisible: boolean = false;
  plannedIncome: number = 0;
  leftToBudget: number = 0;
  remainingToSpend: number = 0;
  constructor(
    public userService: UserService,
    private userRepository: UserRepositoryService,
    private pickerCtrl: PickerController,
    private modalCtrl: ModalController,
    private categoryRepository: CategoryRepositoryService,
    private subcategoryRepository: SubcategoryRepositoryService,
  ) {
    // Set the app to load the current month
    // Storing as a number to easily compare
    this.chosenDateNumber = getNumberMonthYearFromDate();
  }

  async ngOnInit() {
    this.user = await this.userRepository.getCurrentFirestoreUser();
    // User data has been grabbed
    // Lets get their transactions that need to be budgeted
    if (this.user) {
      this.userService.getUserTransactionsFromPlaid(this.user);
      this.getUserCategories()
        .then((categories: Array<Category>) => {
          categories.sort(defaultCategorySort);
          this.user!.categories = categories;
        });
    }
  }

  get chosenDate(): LocaleStringMonthYear { return this._chosenDate; }
  get chosenDateNumber(): NumberMonthYear { return this._chosenDateNumber; }
  set chosenDateNumber(value: NumberMonthYear) {
    this._chosenDateNumber = value;
    this._chosenDate = getMonthYearLocaleString(value);
  }

  async getUserCategories(): Promise<Array<Category>> {
    const queryResult = await this.categoryRepository.getAllFromParent(this.userRepository.getCurrentUserId());
    await this.mutateUserSubcategories(queryResult.docs, this.chosenDateNumber);
    this.calculatePlannedAndBudget(queryResult.docs);
    return queryResult.docs;
  }

  async mutateUserSubcategories(categories: Category[], date: NumberMonthYear): Promise<void> {
    categories.map((doc: Category) => {
      this.subcategoryRepository.getByQuery(buildSubcategoryByDateQuery(this.userRepository.getCurrentUserId(), doc.id!, date))
        .then((subcategories) => {
          doc.subcategories = subcategories.docs;
          return doc;
        });
    });
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
  addNewSub(item: Category) {
    if (item.text == 'income') {
    } else {
      const newSub: Subcategory = {
        text: '',
        index: item.subcategories!.length,
        planned_amount: 0,
        date: {
          month: this.chosenDateNumber.month,
          year: this.chosenDateNumber.year,
        },
        actual_amount: 0,
        id: uuid(),
        isEditing: true,
      };

      item.subcategories!.push(newSub); // hopefully this mutates
      this.subcategoryRepository.add(this.userRepository.getCurrentUserId(), item.id!, newSub, newSub.id);
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
    //this.getUserData();
  }

  /**
   * Emitted from Header, shows a date picker to change the budget date
   */
  async requestDateChange() {
    // Array of years spanning from last 2 years to 2 years from now

    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'month',
          options: MONTH_NAMES_AND_VALUES,
        },
        {
          name: 'year',
          options: PICKER_YEAR_NAMES_AND_VALUES,
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
            this.chosenDateNumber = { month: value.month.value, year: value.year.value };
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
