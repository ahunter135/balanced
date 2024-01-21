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
  Transaction,
} from 'src/app/types/firestore/user';
import { IonInput } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { AlertService } from 'src/app/services/alert.service';

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
  @Input() isUserReorderingCategories: boolean = false;
  @Input() isUserRemovingCategories: boolean = false;
  @Output() addNewSubEvent = new EventEmitter();
  @Output() requestSaveOfSubs = new EventEmitter();
  @Output() subcategorySelected = new EventEmitter();
  @Output() requestDeleteCategory = new EventEmitter();
  @ViewChild('nameInput', { static: false }) nameInput: IonInput;
  @ViewChild('fieldsContainer') fieldsContainer: any;

  transactions = [] as Array<Transaction>;
  checker: any;

  constructor(
    private alertService: AlertService,
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
      return subcategory.actual_amount + subcategory.planned_amount * -1;
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

  async deleteCategory(cat: Category, sub: Subcategory | undefined) {
    /* Don't allow income to be deleted */
    if (cat.id === 'income' && !sub) {
      this.alertService.createAndShowToast(
        "You cannot delete the income category",
      );
      return;
    }
    this.requestDeleteCategory.emit({
      cat,
      sub,
    });
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

  hideKeyboard(ev: any) {
    if (ev.key == 'Enter' || ev.key == 'enter') {
      Keyboard.hide();
    }
  }

  formatCurrency(value: number): string {
    // Use the built-in JavaScript Intl.NumberFormat object for formatting
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      // Other options you want to set
    });

    // Remove the minus sign if the value is negative
    return value < 0 ? formatter.format(-value) : formatter.format(value);
  }
}
