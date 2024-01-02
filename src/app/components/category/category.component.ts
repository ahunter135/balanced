import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  Category,
  Subcategory,
  Transaction
} from 'src/app/types/firestore/user';
import {
  query,
  where,
} from '@angular/fire/firestore';
import { IonInput } from '@ionic/angular';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
import { UserRepositoryService } from 'src/app/repositories/user-repository.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() category: Category;
  @Input() subcategories: Array<Subcategory>;
  @Input() isChecklist: boolean = false;
  @Input() currentView: string = 'planned';
  @Input() chosenDate: any;
  @Output() addNewSubEvent = new EventEmitter();
  @Output() requestSaveOfSubs = new EventEmitter();
  @Output() subcategorySelected = new EventEmitter();
  @ViewChild('nameInput', { static: false }) nameInput: IonInput;
  @ViewChild('fieldsContainer') fieldsContainer: any;
  transactions = [] as Array<Transaction>;
  checker: any;
  constructor(
    private transactionRepositoryService: TransactionsRepositoryService,
    private userRepository: UserRepositoryService,
  ) {}

  ngOnInit() {
    this.checkDOMChange();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] &&
       changes['category'].currentValue &&
       this.userRepository.getCurrentUserId()) {
      this.getTransactionsThenCalculate();
    }
  }

  addNewSub() {
    this.addNewSubEvent.emit();
  }

  triggerIonBlur() {
    // Manually trigger the ionBlur event
    this.shouldWeSaveOrRemove();
  }

  checkDOMChange() {
    this.checker = setTimeout(() => {
      const newSubAdded = document.getElementsByClassName('new-sub');
      if (newSubAdded.length > 0) {
        (newSubAdded[0].childNodes[0] as HTMLIonInputElement).setFocus();
      }
      this.checkDOMChange();
    }, 100);
  }

  stopTimeout() {
    clearTimeout(this.checker);
  }

  shouldWeSaveOrRemove() {
    const shouldAnyBeSaved = this.subcategories.find((sub) => sub.isEditing);
    if (shouldAnyBeSaved) {
      /* Let caller figure out what to do */
      this.requestSaveOfSubs.emit();
    }
  }

  async openBudgetItem(index: number) {
    this.subcategorySelected.emit({
      sub: this.subcategories[index],
      cat: this.category,
    });
  }

  async getTransactionsThenCalculate() {
    for (let i = 0; i < this.subcategories.length; i++) {
      let transactions = await this.transactionRepositoryService.getByQuery(
        query(
          TransactionsRepositoryService.makeCollectionRef(this.userRepository.getCurrentUserId()!),
          where('subcategoryId', '==', this.subcategories[i].id)
        )
      );

      this.calculate(transactions.docs, this.subcategories[i]);
    }
  }

  calculate(transactions: Array<Transaction>, subcategory: Subcategory) {
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const cost = transaction.amount;
      total += cost;
    }
    subcategory.actual_amount = total;
  }

  selectSubCategory(index: number) {
    this.subcategorySelected.emit(this.subcategories[index]);
  }
}
