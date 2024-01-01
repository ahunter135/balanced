import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { UserService } from 'src/app/services/user.service';
import { TransactionsRepositoryService } from 'src/app/repositories/transactions-repository.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Get all relevent transactions
    this.getTransactionsThenCalculate();

    this.checkDOMChange();
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
    for (let i = 0; i < this.subcategories.length; i++) {
      if (this.subcategories[i].isEditing) {
        this.subcategories[i].isEditing = false;
        if (this.subcategories[i].text.length == 0) {
          this.subcategories.splice(i, 1);
        } else {
          // Stuff was typed, lets add it to the DB
          this.requestSaveOfSubs.emit();
        }
      }
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
          TransactionsRepositoryService.makeCollectionRef(this.authService.currentUserId!),
          where('category', '==', this.subcategories[i].id)
        )
      );

      console.log(transactions.docs);
      this.calculate(transactions.docs, this.subcategories[i]);
    }
  }

  calculate(transactions: Array<Transaction>, subcategory: Subcategory) {
    let planned_amount = subcategory.planned_amount;
    let total = 0;
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      const cost = transaction.amount;
      total += cost;
    }
    subcategory.actual_amount = total / 100;
  }

  selectSubCategory(index: number) {
    this.subcategorySelected.emit(this.subcategories[index]);
  }
}
