import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  user: any = {
    name: undefined,
    email: undefined,
    password: undefined,
  };
  constructor(
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {}

  async signUp() {
    /* Verify if the user has filled all the fields */
    try {
      this.verifyUserValues();
    } catch (error: any) {
      this.alertService.createAndShowToast(error.message);
      return;
    }


    try {
      await this.authService.createAccount(this.user.email, this.user.password, { name: this.user.name });
      this.router.navigateByUrl('');
    } catch (error: any) {
      this.alertService.createAndShowToast(error.message);
    }
  }

  private verifyUserValues() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      throw new Error('Please fill all the fields');
    }
  }
}
