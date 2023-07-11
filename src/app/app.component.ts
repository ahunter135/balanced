import { Component } from '@angular/core';
import { User, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private userService: UserService) {
    onAuthStateChanged(getAuth(), (auth) => {
      console.log(auth);
      if (auth) {
        this.userService.setActiveUser(auth as User);
      } else {
        this.userService.setActiveUser(null);
      }
    });
  }
}
