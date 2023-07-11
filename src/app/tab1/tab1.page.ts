import { Component } from '@angular/core';
import { getFirestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { HttpService } from '../services/http.service';
import { User } from '../interfaces/user';
import { Category } from '../interfaces/category';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  user = {} as User;
  institutionName = '';
  transactions = [] as any;
  constructor(private http: HttpService, private userService: UserService) {}

  ngOnInit() {
    this.getUserData();
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
    }
  }
}
