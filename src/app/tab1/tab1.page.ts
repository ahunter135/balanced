import {
  User,
  Category,
  Subcategory,
  Transaction
} from 'src/app/types/firestore/user';
import { Component, ViewEncapsulation } from '@angular/core';
import { generateRandomId } from '../utils/generation';
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
import { TransactionsRepositoryService } from '../repositories/transactions-repository.service';
import { TransactionService } from '../services/transaction.service';
import { AddTransactionComponent } from '../modals/add-transaction/add-transaction.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab1Page {
  /* Chosen year and month to display and budget for */
  private _chosenDate: LocaleStringMonthYear;
  private _chosenDateNumber: NumberMonthYear;

  user?: User;
  transactions: Array<Transaction> = [];

  institutionName: string = '';
  currentView: string = 'budgeted';
  isCardContainerVisible: boolean = false;
  plannedIncome: number = 0;
  leftToBudget: number = 0;
  remainingToSpend: number = 0;

  constructor(
    private userRepository: UserRepositoryService,
    private pickerCtrl: PickerController,
    private modalCtrl: ModalController,
    private categoryRepository: CategoryRepositoryService,
    private subcategoryRepository: SubcategoryRepositoryService,
    private transactionService: TransactionService,
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
      this.transactionService.getTransactions(
        false, // pendingOnly
        true,  // getFromPlaid
        null,  // startDate TODO: Make this the first day of the month
        null,  // endDate
      ).then((transactions: Array<Transaction>) => {
        this.transactions = transactions;
      }).catch((err) => {
        console.error(err);
      });
      this.getUserCategories()
        .then((categories: Array<Category>) => {
          categories.sort(defaultCategorySort);
          this.user!.categories = categories;
          this.calculatePlannedAndBudget(categories);
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
    /* We know user and id exist because we checked in ngOnInit */
    const queryResult = await this.categoryRepository.getAllFromParent(this.user!.id!);
    const promises: Array<Promise<any>> = [];
    /* Grab all subcategories for each category for chosen date */
    for (let i = 0; i < queryResult.docs.length; i++) {
      promises.push(
        this.subcategoryRepository.getByQuery(
          buildSubcategoryByDateQuery(this.user!.id!, queryResult.docs[i].id!, this.chosenDateNumber)
        ).then((subQueryResult) => {
          if (subQueryResult.size == 0) queryResult.docs[i].subcategories = [];
          else queryResult.docs[i].subcategories = subQueryResult.docs;
        })
      );
    }
    await Promise.all(promises);
    return queryResult.docs;
  }

  calculatePlannedAndBudget(categories: Array<any>) {
    let incomeTotal = 0;
    let expenseTotal = 0;
    let actualAmountSpent = 0;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id == 'income') {
        for (let j = 0; j < categories[i].subcategories.length; j++) {
          incomeTotal += categories[i].subcategories[j].planned_amount;
        }
      } else {
        for (let j = 0; j < categories[i].subcategories.length; j++) {
          expenseTotal += categories[i].subcategories[j].planned_amount;
          actualAmountSpent += categories[i].subcategories[j].actual_amount;
        }
      }
    }

    console.log(incomeTotal);
    console.log(expenseTotal);
    console.log(actualAmountSpent);
    this.plannedIncome = incomeTotal;
    this.leftToBudget = this.plannedIncome - expenseTotal;
    this.remainingToSpend = this.plannedIncome - actualAmountSpent;
  }

  /**
   * When user clicks "add new category" this gets called.
   * Its used to add sub categories on each category card
   * @param isIncome - if its income, we do different logic because the income card is
   * not editable. Its permanent, so no need to store it anywhere
   * @param index - category cards are stored as an array, so need to know which was clicked
   */
  addNewSub(item: Category) {
    if (item.id == 'income') return;
    const newSub: Subcategory = {
      text: '',
      index: item.subcategories!.length,
      planned_amount: 0,
      date: {
        month: this.chosenDateNumber.month,
        year: this.chosenDateNumber.year,
      },
      actual_amount: 0,
      id: generateRandomId(),
      isEditing: true,
    };

    item.subcategories!.push(newSub); // hopefully this mutates
    //this.subcategoryRepository.add(this.userRepository.getCurrentUserId()!, item.id!, newSub, newSub.id);
  }

  /**
   * Sub category was added, save to DB
   */
  async saveAllSubs() {
    if (!this.user?.categories) return;
    const promises: Array<Promise<any>> = [];
    for (let i = 0; i < this.user.categories.length; i++) {
      let category = this.user.categories[i];
      if (!category || !category.subcategories) continue;
      for (let j = 0; j < category.subcategories.length; j++) {
        let subcategory = category.subcategories[j];
        if (!subcategory || !subcategory.isEditing) continue;
        if (subcategory.text.length == 0) {
          category.subcategories.splice(j, 1);
          continue;
        }
        subcategory.isEditing = false;
        promises.push(
          this.subcategoryRepository.add(
            this.user.id!,
            this.user.categories[i].id!,
            this.user.categories[i].subcategories![j],
            this.user.categories[i].subcategories![j].id
          )
        );
      }
    }
  }

  /**
   * If segment is changed in header, change view
   * @param ev - emitted from Header
   */
  viewChanged(ev: any) {
    this.currentView = ev;
  }

  async addTransaction() {
    const modal = await this.modalCtrl.create({
      component: AddTransactionComponent,
      componentProps: {
        categories: this.user!.categories!,
        user: this.user
      },
    });

    modal.present();

    modal.onDidDismiss().then((resp: any) => {
      const newTransaction = resp.data;
      if (!newTransaction) return;
      this.transactions.push(newTransaction);
    });
  }

  /**
   * Emitted from Header, shows a date picker to change the budget date
   */
  async requestDateChange() {
    let selectedIndex = [];

    for (let i = 0; i < MONTH_NAMES_AND_VALUES.length; i++) {
      if (MONTH_NAMES_AND_VALUES[i].text == this.chosenDate.month) {
        selectedIndex[0] = i;
        break;
      }
    }

    for (let i = 0; i < PICKER_YEAR_NAMES_AND_VALUES.length; i++) {
      if (PICKER_YEAR_NAMES_AND_VALUES[i].text == this.chosenDate.year) {
        selectedIndex[1] = i;
      }
    }

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
    picker.columns[0].selectedIndex = selectedIndex[0];
    picker.columns[1].selectedIndex = selectedIndex[1];
    await picker.present();
  }

  /**
   * Date has been changed, so grab new data for that months budget
   */
  getDataForNewMonth() {}

  /* Lazy load the pending transactions */
  revealPendingTransactions() {
    this.isCardContainerVisible = !this.isCardContainerVisible;
  }

  parseAmount(amount: number) {
    return amount * -1;
  }

  /* TODO: Figure out what this does */
  async openTransactionSorter(index: number) {
    /*
    const modal = await this.modalCtrl.create({
      component: TransactionSorterComponent,
      componentProps: {
        transaction: this.userService.getPendingTransactions()[index],
      },
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.8, 1],
    });

    modal.present();
    */
  }

  async subcategorySelected(ev: any) {
    const modal = await this.modalCtrl.create({
      component: ViewSubCategoryComponent,
      componentProps: {
        subcategory: ev.sub,
        isIncome: ev.cat.id == 'income',
        category: ev.cat,
      },
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.6, 0.8, 1],
    });

    modal.onDidDismiss().then(() => {
      this.calculatePlannedAndBudget(this.user!.categories!);
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
    const amount = this.leftToBudget;

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
