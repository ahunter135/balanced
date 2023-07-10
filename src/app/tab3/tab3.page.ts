import { Component } from '@angular/core';
import { getAuth, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  constructor() {}

  signOut() {
    signOut(getAuth());
  }
}
