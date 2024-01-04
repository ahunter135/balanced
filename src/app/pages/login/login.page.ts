import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    email: '',
    password: '',
  };
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {}

  async login() {
    try {
      await this.authService.login(this.user.email, this.user.password);
      this.router.navigateByUrl('');
    } catch (error: any) {
      this.alertService.createAndShowToast(error.message);
    }
  }

  async goToCreate() {
    this.router.navigate(['create-account']);
  }
}
