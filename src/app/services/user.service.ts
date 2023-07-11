import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { User as UserInt } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private activeUser: User | UserInt | null;
  constructor() {}

  public getActiveUser() {
    return this.activeUser;
  }

  public setActiveUser(user: User | UserInt | null) {
    this.activeUser = user;
  }
}
