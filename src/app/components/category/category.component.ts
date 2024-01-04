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
  @Input() chosenDate: any;
  @Output() addNewSubEvent = new EventEmitter();
  @Output() requestSaveOfSubs = new EventEmitter();
  @Output() subcategorySelected = new EventEmitter();
  @ViewChild('nameInput', { static: false }) nameInput: IonInput;
  @ViewChild('fieldsContainer') fieldsContainer: any;
  transactions = [] as Array<Transaction>;
  checker: any;
  constructor(
  ) {}

  ngOnInit() {
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

  getSubcategoryRemainingAmount(subcategory: Subcategory): number {
    if (!this.category.id) return 0;
    if (this.category.id === 'income') {
      return subcategory.actual_amount + (subcategory.planned_amount * -1);
    } else {
      return subcategory.planned_amount - subcategory.actual_amount;
    }
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

  selectSubCategory(index: number) {
    this.subcategorySelected.emit(this.subcategories[index]);
  }
}
