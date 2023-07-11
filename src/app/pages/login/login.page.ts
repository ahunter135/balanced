import { Component, OnInit } from '@angular/core';
import { signInWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {
    email: 'hunteraustintn@gmail.com',
    password: 'test123',
  };
  constructor(private router: Router) {}

  ngOnInit() {}

  async login() {
    try {
      await signInWithEmailAndPassword(
        getAuth(),
        this.user.email,
        this.user.password
      );
      this.router.navigateByUrl('');
    } catch (error) {
      alert(error);
    }
  }

  async goToCreate() {
    this.router.navigate(['create-account']);
  }
}
