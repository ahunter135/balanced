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
import { getMonthYearLocaleString, getNumberMonthYearFromDate, getStartAndEndOfMonth } from '../helpers/formatters/dates';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { dateTransactionSort, defaultCategorySort } from '../helpers/sorters/user-related-sorters';
import { CategoryRepositoryService } from '../repositories/category-repository.service';
import { SubcategoryRepositoryService } from '../repositories/subcategory-repository.service';
import { buildSubcategoryByDateQuery } from '../helpers/queries/subcategories';
import { MONTH_NAMES_AND_VALUES, PICKER_YEAR_NAMES_AND_VALUES } from '../constants/dates/dates';
import { TransactionService } from '../services/transaction.service';
import { AddTransactionComponent } from '../modals/add-transaction/add-transaction.component';
import { TransactionPublisherService } from '../services/transaction-publisher.service';
import { ITransactionSubscriber, TransactionEvent } from '../services/interfaces/transaction-publisher';
import { ObjValueMap } from '../utils/data-structures';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Tab1Page implements ITransactionSubscriber {
  /* Chosen year and month to display and budget for */
  private _chosenDate: LocaleStringMonthYear;
  private _chosenDateNumber: NumberMonthYear;

  user?: User;
  /* Map of transactions by month and year to easily separate them */
  transactions: ObjValueMap<NumberMonthYear, Array<Transaction>>;
  /* Map of categories by month and year to easily separate them */
  categories: ObjValueMap<NumberMonthYear, Array<Category>>;

  institutionName: string = '';
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
    private transactionPublisher: TransactionPublisherService,
  ) {
    // Set the app to load the current month
    // Storing as a number to easily compare
    this.chosenDateNumber = getNumberMonthYearFromDate();
    this.transactions = new ObjValueMap<NumberMonthYear, Array<Transaction>>();
    this.categories = new ObjValueMap<NumberMonthYear, Array<Category>>();
  }

  async ngOnInit() {
    this.transactionPublisher.subscribe(this);
    this.user = await this.userRepository.getCurrentFirestoreUser();
    this.grabTransactionsForSelectedMonth()
      .then((transactions: Array<Transaction>) => {
        transactions.sort(dateTransactionSort);
        this.transactions.set(this.chosenDateNumber, transactions);
      });
    this.grabUserCategoriesForSelectedMonth()
      .then((categories: Array<Category>) => {
        categories.sort(defaultCategorySort);
        this.categories.set(this.chosenDateNumber, categories);
        this.calculatePlannedAndBudget(categories);
      });
  }

  async ngOnDestroy() {
    this.transactionPublisher.unsubscribe(this);
  }

  get chosenDate(): LocaleStringMonthYear { return this._chosenDate; }
  get chosenDateNumber(): NumberMonthYear { return this._chosenDateNumber; }
  set chosenDateNumber(value: NumberMonthYear) {
    this._chosenDateNumber = value;
    this._chosenDate = getMonthYearLocaleString(value);
  }

  get startAndEndOfMonth(): { start: Date, end: Date } {
    return getStartAndEndOfMonth(this.chosenDateNumber);
  }

  get transactionsLength(): number {
    const transactions = this.transactions.get(this.chosenDateNumber);
    return transactions ? transactions.length : 0;
  }

  get transactionsArray(): Array<Transaction> {
    return this.transactions.get(this.chosenDateNumber) || [];
  }

  get categoriesLength(): number {
    const categories = this.categories.get(this.chosenDateNumber);
    return categories ? categories.length : 0;
  }

  get categoriesArray(): Array<Category> {
    return this.categories.get(this.chosenDateNumber) || [];
  }

  async grabUserCategoriesForSelectedMonth(): Promise<Array<Category>> {
    if (!this.user) return [];
    const queryResult = await this.categoryRepository.getAllFromParent(this.user!.id!);
    const categories: Array<Category> = queryResult.docs;
    const promises: Array<Promise<any>> = [];
    /* Grab all subcategories for each category for chosen date */
    for (let i = 0; i < categories.length; i++) {
      promises.push(
        this.subcategoryRepository.getByQuery(
          buildSubcategoryByDateQuery(this.user!.id!, queryResult.docs[i].id!, this.chosenDateNumber)
        ).then((subQueryResult) => {
          if (subQueryResult.size == 0) categories[i].subcategories = [];
          else categories[i].subcategories = subQueryResult.docs;
        })
      );
    }
    await Promise.all(promises);
    return categories;
  }

  async grabTransactionsForSelectedMonth(): Promise<Array<Transaction>> {
    if (!this.user) return [];
    const { start, end } = this.startAndEndOfMonth;
    return this.transactionService.getTransactions(
      false,  // includePending
      true,  // includeNonPending
      true,  // getFromPlaid
      start,  // startDate
      end,  // endDate
    );
  }

  calculatePlannedAndBudget(categories: Array<any>) {
    let incomePlannedAmount = 0;
    let expensePlannedAmount = 0;
    let actualAmountSpent = 0;
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id == 'income') {
        for (let j = 0; j < categories[i].subcategories.length; j++) {
          incomePlannedAmount += categories[i].subcategories[j].planned_amount;
        }
      } else {
        for (let j = 0; j < categories[i].subcategories.length; j++) {
          expensePlannedAmount += categories[i].subcategories[j].planned_amount;
          actualAmountSpent += categories[i].subcategories[j].actual_amount;
        }
      }
    }

    console.log(actualAmountSpent);
    this.plannedIncome = incomePlannedAmount;
    this.leftToBudget = (-1 * this.plannedIncome) - expensePlannedAmount;
    this.remainingToSpend = (-1 * this.plannedIncome) - actualAmountSpent;
  }

  /**
   * When user clicks "add new category" this gets called.
   * Its used to add sub categories on each category card
   * @param isIncome - if its income, we do different logic because the income card is
   * not editable. Its permanent, so no need to store it anywhere
   * @param index - category cards are stored as an array, so need to know which was clicked
   */
  addNewSub(item: Category) {
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

    item.subcategories!.push(newSub);
  }

  /**
   * Sub category was added, save to DB
   */
  async saveAllSubs() {
    if (this.categoriesLength == 0 || !this.user) return;
    const promises: Array<Promise<any>> = [];
    for (let i = 0; i < this.categoriesLength; i++) {
      let category = this.categoriesArray[i];
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
            this.categoriesArray[i].id!,
            this.categoriesArray[i].subcategories![j],
            this.categoriesArray[i].subcategories![j].id
          )
        );
      }
    }
  }

  async addTransaction() {
    const modal = await this.modalCtrl.create({
      component: AddTransactionComponent,
      componentProps: {
        categories: this.categoriesArray,
        user: this.user
      },
    });

    modal.present();
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
  getDataForNewMonth() {
    /* TODO: Issue here where we may have plaid transactions for this month,
      * but not firestore transactions. Add way to know.
      */
    const shouldGrabTransactions = !this.transactions.has(this.chosenDateNumber);
    const shouldGrabCategories = !this.categories.has(this.chosenDateNumber);
    if (shouldGrabTransactions) {
      this.grabTransactionsForSelectedMonth()
        .then((transactions: Array<Transaction>) => {
          transactions.sort(dateTransactionSort);
          this.transactions.set(this.chosenDateNumber, transactions);
        });
    }
    if (shouldGrabCategories) {
      this.grabUserCategoriesForSelectedMonth()
        .then((categories: Array<Category>) => {
          categories.sort(defaultCategorySort);
          this.categories.set(this.chosenDateNumber, categories);
          this.calculatePlannedAndBudget(categories);
        });
    }
  }

  /* Lazy load the pending transactions */
  revealPendingTransactions() {
    this.isCardContainerVisible = !this.isCardContainerVisible;
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
      this.calculatePlannedAndBudget(this.categoriesArray);
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

  /* Function that receives transaction events from the TransactionPublisher */
  async onTransactionEvent(event: TransactionEvent): Promise<void> {
    const { addedTransactions, removedTransactions, modifiedTransactions } = event;
    const promises: Array<Promise<Map<string, number> | null>> = [];

    promises.push(this.handleAddedTransactions(addedTransactions));
    promises.push(this.handleRemovedTransactions(removedTransactions));
    promises.push(this.handleModifiedTransactions(modifiedTransactions));

    let resolved = await Promise.all(promises);
    let subcategoryAmountsModified = new Map<string, number>();
    resolved.forEach((map) => {
      if (!map) return;
      map.forEach((value, key) => {
        if (!subcategoryAmountsModified.has(key)) {
          subcategoryAmountsModified.set(key, value);
        } else {
          subcategoryAmountsModified.set(key, subcategoryAmountsModified.get(key)! + value);
        }
      });
    });
    /* Update the subcategory amounts based on the transactions from
    * the event
    */
    for (let [subcategoryId, amount] of subcategoryAmountsModified) {
      this.categoriesArray.forEach((category) => {
        category.subcategories!.forEach((subcategory) => {
          if (subcategory.id == subcategoryId) {
            subcategory.actual_amount += amount;
          }
        });
      });
    }

    this.calculatePlannedAndBudget(this.categoriesArray);
  }

  async handleAddedTransactions(transactions: Array<Transaction>): Promise<Map<string, number> | null> {
    if (!transactions || transactions.length == 0) return null;
    const monthsModified = new Set<NumberMonthYear>();
    const subcategoryAmountsModified = new Map<string, number>();

    for (let i = 0; i < transactions.length; i++) {
      const transaction: Transaction = transactions[i];
      const transactionMonthYear = getNumberMonthYearFromDate(transaction.date);
      monthsModified.add(transactionMonthYear);
      const hasTransactionsForMonth = this.transactions.has(transactionMonthYear);
      if (!hasTransactionsForMonth) {
        this.transactions.set(transactionMonthYear, [transaction]);
      } else {
        this.transactions.get(transactionMonthYear)!.push(transaction);
      }
      const subcategoryId = transaction.subcategoryId;
      if (!subcategoryAmountsModified.has(subcategoryId)) {
        subcategoryAmountsModified.set(subcategoryId, transaction.amount);
      } else {
        subcategoryAmountsModified.set(
          subcategoryId,
          subcategoryAmountsModified.get(subcategoryId)! + transaction.amount
        );
      }
    }
    for (let month of monthsModified) {
      this.transactions.get(month)!.sort(dateTransactionSort);
    }
    return subcategoryAmountsModified;
  }

  async handleRemovedTransactions(transactions: Array<Transaction>): Promise<Map<string, number> | null> {
    return null;
  }

  async handleModifiedTransactions(transactions: Array<Transaction>): Promise<Map<string, number> | null> {
    return null;
  }
}
