import { Component, OnInit } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { doc, getFirestore, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { AlertService } from 'src/app/services/alert.service';

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
        id: userSignUp.user.uid,
        subscribed: false,
        categories: [
          { text: 'housing', index: 0, subcategories: [] },
          { text: 'giving', index: 1, subcategories: [] },
          { text: 'savings', index: 2, subcategories: [] },
          { text: 'transportation', index: 3, subcategories: [] },
          { text: 'food', index: 4, subcategories: [] },
          { text: 'lifestyle', index: 5, subcategories: [] },
          { text: 'insurance', index: 6, subcategories: [] },
          { text: 'debt', index: 7, subcategories: [] },
        ],
        name: this.user.name,
        transaction_sync_cursor: '',
      };

      await setDoc(doc(getFirestore(), 'users', newUser.id), newUser);
      this.router.navigateByUrl('');
    } catch (error) {
      this.alertService.createAndShowToast(error as string);
    }
  }
}
