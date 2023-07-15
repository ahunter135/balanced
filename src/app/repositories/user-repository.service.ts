import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserRepositoryService implement IRepository<User> {

  constructor() { }
}
