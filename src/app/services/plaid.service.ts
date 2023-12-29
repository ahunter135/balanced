import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { LinkedAccountsRepositoryService } from '../repositories/linked-accounts-repository.service';
import { UserRepositoryService } from '../repositories/user-repository.service';

@Injectable({
  providedIn: 'root'
})
export class PlaidService {

  constructor(
    private http: HttpService,
    private linkedAccountsRepository: LinkedAccountsRepositoryService,
    private userRepository: UserRepositoryService,
  ) { }


  async getTransactionsFromPlaid() {

  }
}
