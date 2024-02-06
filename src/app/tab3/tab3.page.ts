import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { PlaidService } from '../services/plaid.service';
import { UserService } from '../services/user.service';
import { InAppPurchaseService } from '../services/in-app-purchase.service';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { User, deleteUser } from '@angular/fire/auth';
import { ViewLinkedAccountsComponent } from '../modals/view-linked-accounts/view-linked-accounts.component';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { AccountPickerComponent } from '../modals/account-picker/account-picker.component';
import { FinicityService } from '../services/finicity.service';
import { User as UserType } from '../types/firestore/user';
import {
  LocalNotifications,
  ScheduleOptions,
  LocalNotificationSchema,
} from '@capacitor/local-notifications';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  institutionName: string;
  budgetReminders: Array<boolean> = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
  user: UserType;
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
    private finicityService: FinicityService,
    public platform: Platform
  ) {}

  ngOnInit() {
    this.getUserData();

    this.cancelUpcomingNotifications();
  }

  async getUserData() {
    const user = await this.authService.getCurrentAuthUser();
    if (!user || !user.uid) return;
    this.user = (await this.userRepository.get(user.uid)) as UserType;
    if (this.user.budgetReminders) {
      this.budgetReminders = this.user.budgetReminders;
    }
  }

  async link() {
    const modal = await this.modalController.create({
      component: AccountPickerComponent,
    });

    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data === 1) {
      this.plaidService.linkPlaidToUser();
    } else if (data === 2) {
      this.finicityService.linkFinicityToUser();
    }
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
      throw new Error('Tab3: user is undefined');
    }
    const modal = await this.modalController.create({
      component: ViewLinkedAccountsComponent,
      componentProps: {
        user,
      },
    });

    modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.link();
    }
  }

  async cancelUpcomingNotifications() {
    if (!this.userService.isPremium) {
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }
    }
  }

  async addNotificationDay(day: number) {
    if (!this.userService.isPremium) return;

    this.budgetReminders[day] = !this.budgetReminders[day];
    this.userRepository.update(this.user.id as string, {
      budgetReminders: this.budgetReminders,
    });
    // Array to hold the notifications to be scheduled
    this.scheduleNotifications();
  }

  async scheduleNotifications() {
    let notifications: LocalNotificationSchema[] = [];

    // Get today's date
    const today = new Date();
    // Loop through the budgetReminders array
    for (let i = 0; i < this.budgetReminders.length; i++) {
      if (this.budgetReminders[i]) {
        let nextDay = new Date();
        nextDay.setDate(today.getDate() + ((i - today.getDay() + 7) % 7));
        nextDay.setHours(18, 0, 0, 0); // Set time to 6 PM
        // 60000 milliseconds = 1 minute

        // Check if nextDay is today and it's already past 6 PM
        if (nextDay.getDay() === today.getDay() && today.getHours() >= 18) {
          nextDay.setDate(nextDay.getDate() + 7); // Schedule for next week
        }

        // Add a notification for this day
        notifications.push({
          id: i,
          title: 'Time to Budget!',
          body: 'Open up your app to sort your transactions!',
          schedule: {
            at: nextDay,
            //repeats: true,
          },
        });
      }
    }
    // Schedule all the notifications
    let obj: ScheduleOptions = {
      notifications: notifications,
    };
    const pending = await LocalNotifications.getPending();

    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.notifications,
      });
    }
    try {
      await LocalNotifications.schedule(obj);
      // Show a success message to the user
      this.alertService.createAndShowToast(
        'Budget reminders have been updated!'
      );
    } catch (error) {
      // Handle any errors and show an error message
      console.error('Error scheduling notifications:', error);
      this.alertService.createAndShowToast(
        'Error updating reminders. Please try again.'
      );
    }
  }

  dayIsActive(day: number) {
    return this.budgetReminders[day];
  }
}
