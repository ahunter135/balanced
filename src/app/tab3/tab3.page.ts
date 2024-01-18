import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { PlaidService } from '../services/plaid.service';
import { UserService } from '../services/user.service';
import { InAppPurchaseService } from '../services/in-app-purchase.service';

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
    public userService: UserService,
    public inapp: InAppPurchaseService
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

  purchase(flag: string) {
    this.inapp.startPurchase(flag);
  }

  goToThemes() {
    this.router.navigateByUrl('tabs/tab3/themes');
  }
}
