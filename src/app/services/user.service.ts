import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private activeUser: User | null;
  constructor() {}

  public getActiveUser() {
    return this.activeUser;
  }

  public setActiveUser(user: User | null) {
    this.activeUser = user;
  }
}
