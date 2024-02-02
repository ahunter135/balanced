import {
  User,
  Category,
  Subcategory,
  Transaction,
} from 'src/app/types/firestore/user';
import { Component, ViewEncapsulation } from '@angular/core';
import { generateRandomId } from '../utils/generation';
import {
  AlertController,
  LoadingController,
  ModalController,
  PickerController,
} from '@ionic/angular';
import { TransactionSorterComponent } from '../modals/transaction-sorter/transaction-sorter.component';
import { ViewSubCategoryComponent } from '../modals/view-sub-category/view-sub-category.component';
import { LocaleStringMonthYear, NumberMonthYear } from '../types/dates/dates';
import {
  getMonthYearLocaleString,
  getNumberMonthYearFromDate,
  getStartAndEndOfMonth,
} from '../helpers/formatters/dates';
import { UserRepositoryService } from '../repositories/user-repository.service';
import {
  dateTransactionSort,
  defaultCategorySort,
} from '../helpers/sorters/user-related-sorters';
import { CategoryRepositoryService } from '../repositories/category-repository.service';
import { SubcategoryRepositoryService } from '../repositories/subcategory-repository.service';
import { buildSubcategoryByDateQuery } from '../helpers/queries/subcategories';
import {
  MONTH_NAMES_AND_VALUES,
  PICKER_YEAR_NAMES_AND_VALUES,
} from '../constants/dates/dates';
import { TransactionService } from '../services/transaction.service';
import { AddTransactionComponent } from '../modals/add-transaction/add-transaction.component';
import { TransactionPublisherService } from '../services/transaction-publisher.service';
import {
  ITransactionSubscriber,
  TransactionEvent,
} from '../services/interfaces/transaction-publisher';
import { ObjValueMap } from '../utils/data-structures';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { TransactionsRepositoryService } from '../repositories/transactions-repository.service';
import { allSubcategoryTransactions } from '../helpers/queries/transactions';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

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
  showCopyBudget: boolean = false;
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

  isUserRemovingCategories: boolean = false;

  constructor(
    private userRepository: UserRepositoryService,
    private pickerCtrl: PickerController,
    private modalCtrl: ModalController,
    private categoryRepository: CategoryRepositoryService,
    private subcategoryRepository: SubcategoryRepositoryService,
    private transactionService: TransactionService,
    private transactionRepository: TransactionsRepositoryService,
    private transactionPublisher: TransactionPublisherService,
    private userService: UserService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    // Set the app to load the current month
    // Storing as a number to easily compare
    this.chosenDateNumber = getNumberMonthYearFromDate();
    this.transactions = new ObjValueMap<NumberMonthYear, Array<Transaction>>();
    this.categories = new ObjValueMap<NumberMonthYear, Array<Category>>();
  }

  async ngOnInit() {
    this.transactionPublisher.subscribe(this);
    this.userSubscription = this.userRepository.currentFirestoreUser.subscribe(
      (user) => {
        this.user = user;
        if (!user) return;
        this.loadMonthData();
      }
    );
  }

  async ngOnDestroy() {
    this.transactionPublisher.unsubscribe(this);
    this.userSubscription?.unsubscribe();
  }

  get chosenDate(): LocaleStringMonthYear {
    return this._chosenDate;
  }
  get chosenDateNumber(): NumberMonthYear {
    return this._chosenDateNumber;
  }
  set chosenDateNumber(value: NumberMonthYear) {
    this._chosenDateNumber = value;
    this._chosenDate = getMonthYearLocaleString(value);
  }

  get startAndEndOfMonth(): { start: Date; end: Date } {
    return getStartAndEndOfMonth(this.chosenDateNumber);
  }

  get transactionsLength(): number {
    const transactions = this.transactions.get(this.chosenDateNumber);
    return transactions ? transactions.length : 0;
  }

  get transactionsArray(): Array<Transaction> {
    return this.transactions.get(this.chosenDateNumber) || [];
  }

  set transactionsArray(value: Array<Transaction>) {
    this.transactions.set(this.chosenDateNumber, value);
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
      Haptics.notification({ type: NotificationType.Success });
      const transactions: Array<Transaction> = results[0];
      const categories: Array<Category> = results[1];
      transactions.sort(dateTransactionSort);
      categories.sort(defaultCategorySort);
      this.transactions.set(this.chosenDateNumber, transactions);
      this.unsortedTransactions = transactions.filter(
        (t) => !t.subcategoryId || t.subcategoryId == ''
      );
      this.categories.set(this.chosenDateNumber, categories);

      this.shouldShowCopyBudget();
      this.calculatePlannedAndBudget(categories);
    });
  }

  async grabUserCategoriesForSelectedMonth(
    shouldUsePreviousMonth = false
  ): Promise<Array<Category>> {
    if (!this.user) return [];
    const queryResult = await this.categoryRepository.getAllFromParent(
      this.user!.id!
    );
    const categories: Array<Category> = queryResult.docs;
    const promises: Array<Promise<any>> = [];
    let overrideDate: NumberMonthYear;
    if (shouldUsePreviousMonth) {
      let currentMonth = this.chosenDateNumber.month;
      let currentYear = this.chosenDateNumber.year;
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }

      overrideDate = {
        month: currentMonth,
        year: currentYear,
      };
    }
    /* Grab all subcategories for each category for chosen date */
    for (let i = 0; i < categories.length; i++) {
      promises.push(
        this.subcategoryRepository
          .getByQuery(
            buildSubcategoryByDateQuery(
              this.user!.id!,
              queryResult.docs[i].id!,
              shouldUsePreviousMonth ? overrideDate! : this.chosenDateNumber
            )
          )
          .then((subQueryResult) => {
            if (subQueryResult.size == 0) categories[i].subcategories = [];
            else categories[i].subcategories = subQueryResult.docs;
            categories[i].subcategories!.sort(defaultCategorySort);
          })
      );
    }
    await Promise.all(promises);
    return categories;
  }

  async shouldShowCopyBudget() {
    if (!this.user) return [];
    const queryResult = await this.categoryRepository.getAllFromParent(
      this.user!.id!
    );
    const categories: Array<Category> = queryResult.docs;
    let subcategories: Array<Subcategory> = [];
    const promises: Array<Promise<any>> = [];
    /* Grab all subcategories for each category for chosen date */
    for (let i = 0; i < categories.length; i++) {
      await this.subcategoryRepository
        .getByQuery(
          buildSubcategoryByDateQuery(
            this.user!.id!,
            queryResult.docs[i].id!,
            this.chosenDateNumber
          )
        )
        .then((subQueryResult) => {
          if (subQueryResult.size == 0) return;
          else subcategories = subQueryResult.docs;
          subcategories.sort(defaultCategorySort);
        });
    }
    this.showCopyBudget = subcategories.length == 0;
    return;
  }

  async grabTransactionsForSelectedMonth(): Promise<Array<Transaction>> {
    if (!this.user) return [];
    const { start, end } = this.startAndEndOfMonth;
    return this.transactionService.getTransactions(
      true, // includePending
      this.userService.isPremium, // syncPlaid (only sync if premium)
      start, // startDate
      end // endDate
    );
  }

  updateSubcategoryActualAmounts(): boolean {
    const currentMonthTransactions = this.transactions.get(
      this.chosenDateNumber
    );
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
      for (
        let j = 0;
        j < currentMonthCategories[i].subcategories!.length;
        j++
      ) {
        const subcategory = currentMonthCategories[i].subcategories![j];
        if (subcategoryActualAmounts.has(subcategory.id!)) {
          subcategory.actual_amount = subcategoryActualAmounts.get(
            subcategory.id!
          )!;
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
    this.leftToBudget = -1 * this.plannedIncome - expensePlannedAmount;
    if (this.leftToBudget <= -0 && this.leftToBudget > -0.01)
      this.leftToBudget = 0; // -0 shows up sometimes
    this.remainingToSpend = -1 * this.plannedIncome - actualAmountSpent;
  }

  /**
   * When user clicks "add new category" this gets called.
   * Its used to add sub categories on each category card
   * @param isIncome - if its income, we do different logic because the income card is
   * not editable. Its permanent, so no need to store it anywhere
   * @param index - category cards are stored as an array, so need to know which was clicked
   */
  addNewSub(item: Category) {
    /* Make sure delete buttons go away */
    this.isUserRemovingCategories = false;
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
        user: this.user,
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
            this.chosenDateNumber = {
              month: value.month.value,
              year: value.year.value,
            };
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
    Haptics.impact({ style: ImpactStyle.Light });
    this.isCardContainerVisible = !this.isCardContainerVisible;
  }

  async openTransactionSorter(transaction: Transaction) {
    await Haptics.impact({ style: ImpactStyle.Light });
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

    modal.onDidDismiss().then((event: any) => {
      if (
        event &&
        event.data &&
        event.data.action == 'edit' &&
        event.data.transaction
      ) {
        this.openTransactionSorter(event.data.transaction);
      }
      this.calculatePlannedAndBudget(this.categoriesArray);
    });
    modal.present();
  }

  formatCurrency(
    value: number,
    currencyCode: string = 'USD',
    locale: string = 'en-US'
  ): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      // Other options you want to set
    });

    // Remove the minus sign if the value is negative
    return value < 0
      ? formatter.format(-value)
      : value == 0
      ? '$0.00'
      : formatter.format(value);
  }

  /* Function that receives transaction events from the TransactionPublisher */
  async onTransactionEvent(event: TransactionEvent): Promise<void> {
    const { addedTransactions, removedTransactions, modifiedTransactions } =
      event;
    const promises: Array<Promise<void>> = [];

    /** These return maps with subcategory ids as keys and amounts as values
     * to be added to the subcategory amounts.
     */
    promises.push(this.handleAddedTransactions(addedTransactions));
    promises.push(this.handleRemovedTransactions(removedTransactions));
    promises.push(this.handleModifiedTransactions(modifiedTransactions));

    Promise.all(promises).then((results) => {
      this.calculatePlannedAndBudget(this.categoriesArray);
      this.unsortedTransactions = this.transactionsArray.filter(
        (t) => !t.subcategoryId || t.subcategoryId == ''
      );
    });
  }

  async handleAddedTransactions(
    transactions: Array<Transaction>
  ): Promise<void> {
    if (!transactions || transactions.length == 0) return;

    for (let i = 0; i < transactions.length; i++) {
      const transaction: Transaction = transactions[i];
      const transactionMonthYear = getNumberMonthYearFromDate(transaction.date);
      if (this.transactions.has(transactionMonthYear)) {
        this.transactions.get(transactionMonthYear)!.push(transaction);
      }
    }
  }

  async handleRemovedTransactions(
    transactions: Array<Transaction>
  ): Promise<void> {
    for (let i = 0; i < transactions.length; i++) {
      const transaction: Transaction = transactions[i];
      const transactionMonthYear = getNumberMonthYearFromDate(transaction.date);
      if (this.transactions.has(transactionMonthYear)) {
        const transactionsArray = this.transactions.get(transactionMonthYear)!;
        const index = transactionsArray.findIndex(
          (t) => t.id == transaction.id
        );
        if (index >= 0) transactionsArray.splice(index, 1);
      }
    }
  }

  async handleModifiedTransactions(
    transactions: Array<Transaction>
  ): Promise<void> {
    for (let i = 0; i < transactions.length; i++) {
      const transaction: Transaction = transactions[i];
      const transactionMonthYear = getNumberMonthYearFromDate(transaction.date);
      if (this.transactions.has(transactionMonthYear)) {
        const transactionsArray = this.transactions.get(transactionMonthYear)!;
        const index = transactionsArray.findIndex(
          (t) => t.id == transaction.id
        );
        if (index >= 0) {
          transactionsArray[index] = transaction;
        }
      }
    }
  }

  async addCategory() {
    const alert = await this.alertController.create({
      header: 'Add a new category',
      inputs: [
        {
          name: 'categoryName',
          type: 'text',
          placeholder: 'Category name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Add',
          handler: this.addCategoryHandler.bind(this),
        },
      ],
    });
    alert.present();
  }

  async addCategoryHandler(data: any) {
    if (!data || !data.categoryName || data.categoryName.length == 0) {
      return;
    }
    const loader = await this.loadingController.create();
    await loader.present();
    try {
      let id = data.categoryName.toLowerCase();
      /* Make sure id is unique */
      if (this.categoriesArray.find((c) => c.id == id))
        throw new Error('Category already exists');

      const newCategory: Category = {
        id,
        index: this.categoriesArray.length,
        editable: true,
      };
      this.categoriesArray.push(newCategory);
      await this.categoryRepository.add(
        this.user!.id!,
        newCategory,
        newCategory.id!
      );
    } catch (err) {
      console.log(err);
    } finally {
      loader.dismiss();
    }
  }

  toggleRemoveCategories() {
    this.isUserRemovingCategories = !this.isUserRemovingCategories;
  }

  /** Bad naming, but this will be used for category and
   * subcategory removal.
   */
  async deleteCategory(ev: any) {
    const headerCustomText = ev.cat && ev.sub ? ev.sub.text : ev.cat.id;
    let message = 'Are you sure you want to delete this?';
    if (ev.cat && !ev.sub) {
      message +=
        ' All subcategories, even past ones, will be permanently deleted too.';
    }
    const initialAlert = await this.alertController.create({
      header: 'Delete ' + headerCustomText + '?',
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          handler: () => {
            Haptics.notification({ type: NotificationType.Success });
            /* Case 1: Just subcategory, no category */
            if (ev.cat && ev.sub) {
              this.handleDeleteOnlySubcategory(ev.cat, ev.sub);
            } else if (ev.cat && !ev.sub) {
              /* Case 2: Just category and all subcategories by extension */
              this.handleDeleteWholeCategory(ev.cat);
            }
          },
        },
      ],
    });

    await initialAlert.present();
  }

  async handleDeleteOnlySubcategory(
    category: Category,
    subcategory: Subcategory
  ) {
    const loader = await this.loadingController.create();
    await loader.present();
    console.log(`Deleting subcategory ${subcategory.text} in ${category.id}`);
    const transactionsInSubcategory = this.transactionsArray.filter(
      (t) => t.subcategoryId == subcategory.id
    );
    const length = transactionsInSubcategory.length;

    /* Handle differently if no transactions */
    if (length == 0) {
      this.removeSubcategoryFromDatabaseAndArray(category, subcategory);
      loader.dismiss();
      return;
    }
    /* Handle when there are transactions */
    const handleTransactionsAlert = await this.alertController.create({
      header: 'Where should the transactions go?',
      message: `There ${length > 1 ? 'are' : 'is'} ${length} transaction${
        length > 1 ? 's' : ''
      }
        in this category. What would you like to do with ${
          length > 1 ? 'them' : 'it'
        }?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Move to unsorted',
          handler: () => {
            transactionsInSubcategory.forEach((t) => {
              t.subcategoryId = '';
            });
            this.transactionPublisher.publishEvent({
              from: 'manual',
              addedTransactions: [],
              modifiedTransactions: transactionsInSubcategory,
              removedTransactions: [],
            });
            this.removeSubcategoryFromDatabaseAndArray(category, subcategory);
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.transactionPublisher.publishEvent({
              from: 'manual',
              addedTransactions: [],
              modifiedTransactions: [],
              removedTransactions: transactionsInSubcategory,
            });
            this.removeSubcategoryFromDatabaseAndArray(category, subcategory);
          },
        },
      ],
    });
    loader.dismiss();
    await handleTransactionsAlert.present();
  }

  async handleDeleteWholeCategory(category: Category) {
    console.log(`Deleting category  ${category.id}`);
    const loader = await this.loadingController.create();
    await loader.present();
    const allSubcategories = await this.subcategoryRepository.getAllFromParent(
      this.user!.id!,
      category.id!
    );
    /* No subcategories, just delete */
    if (allSubcategories.size == 0) {
      await this.removeCategoryFromDatabaseAndArray(category, []);
      loader.dismiss();
      return;
    }
    /* Handle when there are subcategories */
    let promises: Array<Promise<any>> = [];
    /* Get all transactions in all subcategories */
    for (let i = 0; i < allSubcategories.size; i++) {
      const promise = this.transactionRepository.getByQuery(
        allSubcategoryTransactions(this.user!.id!, allSubcategories.docs[i].id!)
      );
      promises.push(promise);
    }
    const results = await Promise.all(promises);
    const transactions: Array<Transaction> = [];
    /* Flatten the results */
    results.forEach((result) => {
      result.docs.forEach((doc: Transaction) => {
        transactions.push(doc);
      });
    });
    const length = transactions.length;
    const handleTransactionsAlert = await this.alertController.create({
      header: 'Where should the transactions go?',
      message: `There ${length > 1 ? 'are' : 'is'} ${length} transaction${
        length > 1 ? 's' : ''
      }
        in this category. What would you like to do with ${
          length > 1 ? 'them' : 'it'
        }?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Move to unsorted',
          handler: () => {
            transactions.forEach((t) => {
              t.subcategoryId = '';
            });
            this.transactionPublisher.publishEvent({
              from: 'manual',
              addedTransactions: [],
              modifiedTransactions: transactions,
              removedTransactions: [],
            });
            this.removeCategoryFromDatabaseAndArray(
              category,
              allSubcategories.docs
            );
          },
        },
        {
          text: 'Delete',
          handler: () => {
            this.transactionPublisher.publishEvent({
              from: 'manual',
              addedTransactions: [],
              modifiedTransactions: [],
              removedTransactions: transactions,
            });
            this.removeCategoryFromDatabaseAndArray(
              category,
              allSubcategories.docs
            );
          },
        },
      ],
    });
    loader.dismiss();
    await handleTransactionsAlert.present();
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
      const alignWith = document.getElementById(
        b.id.replace('-reorder', '') + '-card'
      );
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
      this.categoryRepository.update(this.user!.id!, category.id!, {
        index: index,
      });
    });
    /* Call so ion-reorder knows we're done */
    ev.detail.complete();
  }

  private async removeCategoryFromDatabaseAndArray(
    category: Category,
    subcategories: Array<Subcategory>
  ) {
    let promises: Array<Promise<any>> = [];
    /* Delete all subcategories */
    subcategories.forEach((subcategory) => {
      promises.push(
        this.removeSubcategoryFromDatabaseAndArray(category, subcategory)
      );
    });
    await Promise.all(promises);
    this.categoryRepository.delete(this.user!.id!, category.id!, true);
    const index = this.categoriesArray.findIndex((c) => c.id == category.id);
    if (index >= 0) this.categoriesArray.splice(index, 1);
  }

  private async removeSubcategoryFromDatabaseAndArray(
    category: Category,
    subcategory: Subcategory
  ) {
    this.subcategoryRepository.delete(
      this.user!.id!,
      category.id!,
      subcategory.id!,
      true
    );
    const index = category.subcategories!.findIndex(
      (s) => s.id == subcategory.id
    );
    if (index >= 0) category.subcategories!.splice(index, 1);

    this.shouldShowCopyBudget();
  }

  async copyOverBudget() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to copy last months budget?',

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: async () => {
            const categories = await this.grabUserCategoriesForSelectedMonth(
              true
            );

            categories.sort(defaultCategorySort);

            this.categories.set(this.chosenDateNumber, categories);

            this.calculatePlannedAndBudget(categories);
            categories.forEach((cat) => {
              cat.subcategories?.forEach((sub) => {
                console.log(sub);
                sub.date.month = this.chosenDateNumber.month;
                sub.date.year = this.chosenDateNumber.year;
                this.subcategoryRepository.add(
                  this.user?.id as string,
                  cat.id!,
                  sub
                );
              });
            });

            this.shouldShowCopyBudget();
          },
        },
      ],
    });
    alert.present();
  }
}
