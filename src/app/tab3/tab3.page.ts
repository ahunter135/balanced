import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { PlaidService } from '../services/plaid.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  institutionName: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private plaidService: PlaidService,
  ) {}

  async link() {
    this.plaidService.linkPlaidToUser();
  }

  async signOut() {
    const success = await this.authService.logout();
    if (success) {
      this.router.navigateByUrl('login');
    } else {
      this.alertService.createAndShowToast('There was an error logging out');
    }
  }
}
