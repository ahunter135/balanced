import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { PlaidService } from '../services/plaid.service';
import { UserService } from '../services/user.service';
import { InAppPurchaseService } from '../services/in-app-purchase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { User, deleteUser } from '@angular/fire/auth';
import { ViewLinkedAccountsComponent } from '../modals/view-linked-accounts/view-linked-accounts.component';
import { UserRepositoryService } from '../repositories/user-repository.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  institutionName: string;

  constructor(
    public modalController: ModalController,
    public userService: UserService,
    public inapp: InAppPurchaseService,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService,
    private plaidService: PlaidService,
    private alertCtrl: AlertController,
    private userRepository: UserRepositoryService,
  ) {}

  ngOnInit() {
    // WEEWOOWEEWOO!! If I forget to take this out, wow
    this.viewLinkedAccounts();
    console.warn("CARTER LEFT SOMETHING IN TAB3 ONINIT");
  }

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

  async deleteAccount() {
    const alertW = await this.alertCtrl.create({
      header: 'Are you sure you want to delete your account?',
      buttons: [
        {
          text: 'Yes',
          role: 'destructive',
          handler: async () => {
            const user = (await this.authService.getCurrentAuthUser()) as User;
            deleteUser(user).then(() => window.location.reload());
          },
        },
        {
          text: 'No',
          handler: async () => {
            return;
          },
        },
      ],
    });

    alertW.present();
  }

  async viewLinkedAccounts() {
    const user = await this.userRepository.getCurrentFirestoreUser();
    if (!user) {
      /* How could this happen? */
      throw new Error("Tab3: user is undefined");
    }
    const modal = await this.modalController.create({
      component: ViewLinkedAccountsComponent,
      componentProps: {
        user,
      },
    });

    modal.present();
  }
}
