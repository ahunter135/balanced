import { ChangeDetectorRef, Component } from '@angular/core';
import { getFirestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { HttpService } from '../services/http.service';
import { User } from '../interfaces/user';
import { Category } from '../interfaces/category';
import { UserService } from '../services/user.service';
import { CalculationService } from '../services/calculation.service';
import { Subcategory } from '../interfaces/subcategory';
import { v4 as uuid } from 'uuid';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  user = {} as User;
  institutionName = '';
  transactions = [] as any;
  currentView: string = 'planned';
  constructor(
    private http: HttpService,
    private userService: UserService,
    private calculator: CalculationService,
    private chRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getUserData().then(() => {
      this.calculator.startCalculations();
    });
  }

  async getUserData() {
    let userDoc = await getDoc(
      doc(
        getFirestore(),
        'users',
        this.userService.getActiveUser()?.uid as string
      )
    );

    if (userDoc.exists()) {
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
      this.user = userDoc.data() as User;
      this.user.categories = categories;
      console.log(this.user);
      this.userService.setActiveUser(this.user);
    }
  }

  addNewSub(isIncome: boolean, index: number) {
    if (isIncome) {
    } else {
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
  }

  async saveAllSubs() {
    console.log(this.user);
    updateDoc(doc(getFirestore(), 'users', this.user.uid as string), {
      categories: [...this.user.categories],
    });
  }

  viewChanged(ev: any) {
    this.currentView = ev;
  }
}
