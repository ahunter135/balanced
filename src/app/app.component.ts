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
  }
}
