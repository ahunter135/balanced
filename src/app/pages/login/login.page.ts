import { Component, OnInit } from '@angular/core';
import { signInWithEmailAndPassword, getAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    email: 'hunteraustintn@gmail.com',
    password: 'test123'
  }
  constructor() { }

  ngOnInit() {
  }

  login() {
    signInWithEmailAndPassword(getAuth(), this.user.email, this.user.password);
  }

}
