import { Component } from '@angular/core';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.configureFirebaseEnvironment();
  }

  configureFirebaseEnvironment() {
    /* Use the Firestore emulator in development. */
    if (!environment.production && environment.useFirestoreEmulator) {
      const db = getFirestore();
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.warn("Using the Firestore emulator.");
    }
    /* Use the Firebase Auth emulator in development. */
    if (!environment.production && environment.useFirebaseAuthEmulator) {
      const auth = getAuth();
      connectAuthEmulator(auth, 'http://localhost:9099');
      console.warn("Using the Firebase Auth emulator.");
    }
  }
}
