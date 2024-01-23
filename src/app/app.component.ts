import { Component } from '@angular/core';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import { environment } from 'src/environments/environment';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AuthService } from './services/auth.service';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { InAppPurchaseService } from './services/in-app-purchase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private purchaseService: InAppPurchaseService
  ) {
    this.configureFirebaseEnvironment();
    this.setTheme();
  }

  shadeColor(color: string, amount: number): string {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (1 - amount)).toString());
    G = parseInt((G * (1 - amount)).toString());
    B = parseInt((B * (1 - amount)).toString());

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    const RR =
      R.toString(16).length === 1 ? '0' + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? '0' + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
  }

  async setTheme() {
    const currentTheme = await Preferences.get({ key: 'theme' });
    console.log(currentTheme.value);
    if (currentTheme.value) {
      const htmlEl = document.querySelector('html');
      if (htmlEl) {
        const shade = this.shadeColor(
          JSON.parse(currentTheme.value).value,
          0.5
        );
        htmlEl.style.setProperty('--ion-color-primary-shade', shade);
        htmlEl.style.setProperty(
          '--ion-color-primary',
          JSON.parse(currentTheme.value).value
        );
        htmlEl.style.setProperty(
          '--ion-color-primary-contrast',
          JSON.parse(currentTheme.value).darkText ? '#000000' : '#FFFFFF'
        );
      }
    } else {
      const htmlEl = document.querySelector('html');
      if (htmlEl) {
        htmlEl.style.setProperty('--ion-color-primary', '#00eabb');
      }
    }
  }

  ngOnInit() {
    /* Wrapped this to prevent browser errors */
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration', (token: Token) => {
        this.authService.userToken = token.value;
        console.log(token.value);
      });

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError', (error: any) => {
        // alert('Error on registration: ' + JSON.stringify(error));
      });

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          // alert('Push received: ' + JSON.stringify(notification));
        }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          // alert('Push action performed: ' + JSON.stringify(notification));
        }
      );
    }
  }

  configureFirebaseEnvironment() {
    /* Use the Firestore emulator in development. */
    if (!environment.production && environment.useFirestoreEmulator) {
      const db = getFirestore();
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.warn('Using the Firestore emulator.');
    }
    /* Use the Firebase Auth emulator in development. */
    if (!environment.production && environment.useFirebaseAuthEmulator) {
      const auth = getAuth();
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.warn('Using the Firebase Auth emulator.');
    }
    if (!environment.production && environment.useFunctionsEmulator) {
      const functions = getFunctions();
      connectFunctionsEmulator(functions, 'localhost', 5001);
      console.warn('Using the Firebase Functions emulator.');
    }
  }
}
