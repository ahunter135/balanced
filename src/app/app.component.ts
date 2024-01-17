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
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService: AuthService) {
    this.configureFirebaseEnvironment();
  }

  ngOnInit() {
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
