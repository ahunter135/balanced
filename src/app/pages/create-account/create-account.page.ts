import { Component, OnInit } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { doc, getFirestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  user: any = {};
  constructor(private alertService: AlertService, private router: Router) {}

  ngOnInit() {}

  async signUp() {
    try {
      const userSignUp = await createUserWithEmailAndPassword(
        getAuth(),
        this.user.email,
        this.user.password
      );

      const newUser: User = {
        email: this.user.email,
        uid: userSignUp.user.uid,
        subscribed: false,
        categories: [
          {
            text: 'income',
            index: 0,
            subcategories: [],
            id: uuid(),
            editable: false,
          },
          {
            text: 'housing',
            index: 1,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
          {
            text: 'giving',
            index: 2,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
          {
            text: 'savings',
            index: 3,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
          {
            text: 'transportation',
            index: 4,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
          {
            text: 'food',
            index: 5,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
          {
            text: 'lifestyle',
            index: 6,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
          {
            text: 'insurance',
            index: 7,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
          {
            text: 'debt',
            index: 8,
            subcategories: [],
            id: uuid(),
            editable: true,
          },
        ],
        name: this.user.name,
      };

      await setDoc(doc(getFirestore(), 'users', newUser.uid), newUser);
      this.router.navigateByUrl('');
    } catch (error) {
      this.alertService.createAndShowToast(error as string);
    }
  }
}
