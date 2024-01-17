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
import { Subscription } from 'rxjs';

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
  userSubscription?: Subscription;
  /* Map of transactions by month and year to easily separate them */
  transactions: ObjValueMap<NumberMonthYear, Array<Transaction>>;
  /* Map of categories by month and year to easily separate them */
  categories: ObjValueMap<NumberMonthYear, Array<Category>>;

  unsortedTransactions: Array<Transaction> = [];

  institutionName: string = '';
  isCardContainerVisible: boolean = false;
  plannedIncome: number = 0;
  leftToBudget: number = 0;
  remainingToSpend: number = 0;

  /* Whether the user is currently reordering the categories */
  isUserReorderingCategories: boolean = false;

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
    this.userSubscription = this.userRepository.currentFirestoreUser.subscribe((user) => {
      this.user = user;
      if (!user) return;
      this.loadMonthData();
    });
  }

  async ngOnDestroy() {
    this.transactionPublisher.unsubscribe(this);
    this.userSubscription?.unsubscribe();
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

  async loadMonthData() {
    const promises: Array<Promise<any>> = [];
    promises.push(this.grabTransactionsForSelectedMonth());
    promises.push(this.grabUserCategoriesForSelectedMonth());
    Promise.all(promises).then((results) => {
      const transactions: Array<Transaction> = results[0];
      const categories: Array<Category> = results[1];
      transactions.sort(dateTransactionSort);
      categories.sort(defaultCategorySort);
      this.transactions.set(this.chosenDateNumber, transactions);
      this.unsortedTransactions = transactions.filter((t) => !t.subcategoryId || t.subcategoryId == '');
      this.categories.set(this.chosenDateNumber, categories);
      this.calculatePlannedAndBudget(categories);
    });
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
          categories[i].subcategories!.sort(defaultCategorySort);
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
      true,    // includePending
      true,    // syncPlaid
      start,   // startDate
      end,     // endDate
    );
  }

  updateSubcategoryActualAmounts(): boolean {
    const currentMonthTransactions = this.transactions.get(this.chosenDateNumber);
    if (!currentMonthTransactions) return false;
    const currentMonthCategories = this.categories.get(this.chosenDateNumber);
    if (!currentMonthCategories) return false;

    let subcategoryActualAmounts = new Map<string, number>();

    for (let i = 0; i < currentMonthTransactions.length; i++) {
      const t = currentMonthTransactions[i];
      if (!subcategoryActualAmounts.has(t.subcategoryId)) {
        subcategoryActualAmounts.set(t.subcategoryId, t.amount);
      } else {
        subcategoryActualAmounts.set(
          t.subcategoryId,
          subcategoryActualAmounts.get(t.subcategoryId)! + t.amount
        );
      }
    }

    for (let i = 0; i < currentMonthCategories.length; i++) {
      for (let j = 0; j < currentMonthCategories[i].subcategories!.length; j++) {
        const subcategory = currentMonthCategories[i].subcategories![j];
        if (subcategoryActualAmounts.has(subcategory.id!)) {
          subcategory.actual_amount = subcategoryActualAmounts.get(subcategory.id!)!;
        } else {
          subcategory.actual_amount = 0;
        }
      }
    }
    return true;
  }

  calculatePlannedAndBudget(categories: Array<any>) {
    this.updateSubcategoryActualAmounts();
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

    this.plannedIncome = incomePlannedAmount;
    this.leftToBudget = (-1 * this.plannedIncome) - expensePlannedAmount;
    if (this.leftToBudget <= -0 && this.leftToBudget > -0.01)
      this.leftToBudget = 0; // -0 shows up sometimes
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
            this.loadMonthData();
          },
        },
      ],
    });
    picker.columns[0].selectedIndex = selectedIndex[0];
    picker.columns[1].selectedIndex = selectedIndex[1];
    await picker.present();
  }

  revealUnsortedTransactions() {
    this.isCardContainerVisible = !this.isCardContainerVisible;
  }

  async openTransactionSorter(transaction: Transaction) {
    const modal = await this.modalCtrl.create({
      component: TransactionSorterComponent,
      componentProps: {
        transaction: transaction,
        user: this.user,
        categories: this.categoriesArray,
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
        transactions: this.transactionsArray,
        user: this.user,
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
    const promises: Array<Promise<void>> = [];

    /** These return maps with subcategory ids as keys and amounts as values
      * to be added to the subcategory amounts.
      */
    promises.push(this.handleAddedTransactions(addedTransactions));
    promises.push(this.handleRemovedTransactions(removedTransactions));
    promises.push(this.handleModifiedTransactions(modifiedTransactions));

    Promise.all(promises).then((results) => {
      this.calculatePlannedAndBudget(this.categoriesArray);
      this.unsortedTransactions = this.transactionsArray
        .filter((t) => !t.subcategoryId || t.subcategoryId == '');
    });
  }

  async handleAddedTransactions(transactions: Array<Transaction>): Promise<void> {
    if (!transactions || transactions.length == 0) return;

    for (let i = 0; i < transactions.length; i++) {
      const transaction: Transaction = transactions[i];
      const transactionMonthYear = getNumberMonthYearFromDate(transaction.date);
      if (this.transactions.has(transactionMonthYear)) {
        this.transactions.get(transactionMonthYear)!.push(transaction);
      }
    }
  }

  async handleRemovedTransactions(transactions: Array<Transaction>): Promise<void> {
    for (let i = 0; i < transactions.length; i++) {
      const transaction: Transaction = transactions[i];
      const transactionMonthYear = getNumberMonthYearFromDate(transaction.date);
      if (this.transactions.has(transactionMonthYear)) {
        const transactionsArray = this.transactions.get(transactionMonthYear)!;
        transactionsArray.splice(transactionsArray.indexOf(transaction), 1);
      }
    }
  }

  async handleModifiedTransactions(transactions: Array<Transaction>): Promise<void> {
    for (let i = 0; i < transactions.length; i++) {
      const transaction: Transaction = transactions[i];
      const transactionMonthYear = getNumberMonthYearFromDate(transaction.date);
      if (this.transactions.has(transactionMonthYear)) {
        const transactionsArray = this.transactions.get(transactionMonthYear)!;
        const index = transactionsArray.indexOf(transaction);
        if (index >= 0) {
          transactionsArray[index] = transaction;
        }
      }
    }
  }

  toggleReorder() {
    if (this.isUserReorderingCategories) {
      this.hideReorderButton();
    } else {
      this.showReorderButton();
    }
  }

  showReorderButton() {
    /** Have to do weird stuff because we have components inside the ion-item.
      * This sets the reorder button to the right of the card.
      */
    const buttons = document.getElementsByClassName('reorder-button');
    if (buttons.length == 0) return;
    this.isUserReorderingCategories = true;
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i] as HTMLElement;
      const alignWith = document.getElementById(b.id.replace('-reorder', '') + '-card');
      if (!alignWith) continue;
      b.style.left = alignWith.clientWidth - 50 + 'px';
      b.style.opacity = '1';
    }
  }

  hideReorderButton() {
    const buttons = document.getElementsByClassName('reorder-button');
    if (buttons.length == 0) return;
    for (let i = 0; i < buttons.length; i++) {
      const b = buttons[i] as HTMLElement;
      b.style.opacity = '0';
    }
    this.isUserReorderingCategories = false;
  }

  async doneReorderItems(ev: any) {
    if (ev.detail.from == undefined || ev.detail.to == undefined) {
      ev.detail.complete();
      return;
    }
    if (ev.detail.from == ev.detail.to) {
      ev.detail.complete();
      return;
    }
    /** Hold the previous indexes of the categories so we
      * know which to update in the database.
      */
    const previousIndexes = new Map<string, number>();
    this.categoriesArray.forEach((category, index) => {
      previousIndexes.set(category.id!, index);
    });
    const movedCategory = this.categoriesArray[ev.detail.from];
    this.categoriesArray.splice(ev.detail.from, 1);
    this.categoriesArray.splice(ev.detail.to, 0, movedCategory);

    /* Update the indexes of the categories */
    this.categoriesArray.forEach((category, index) => {
      if (previousIndexes.get(category.id!) == index) return;
      this.categoryRepository.update(this.user!.id!, category.id!, { index: index });
    });
    /* Call so ion-reorder knows we're done */
    ev.detail.complete();
  }
}
