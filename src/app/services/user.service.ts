import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRepositoryService } from '../repositories/user-repository.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isPremium: boolean;
  freePremium: boolean = false;
  constructor(
    private authService: AuthService,
    private userRepository: UserRepositoryService
  ) {
    this.userRepository.currentFirestoreUser.subscribe((user) => {
      if (user) this.isPremium = user.subscribed;
      if (user) this.freePremium = user.freePremium;
    });
  }

  public async updatePremiumStatus(isPremium: boolean) {
    const user = await this.authService.getCurrentAuthUser();
    if (!user || !user.uid) return;
    this.isPremium = isPremium;
    this.userRepository.update(user.uid, {
      subscribed: this.freePremium ? true : isPremium,
      token: this.authService.userToken,
    });
  }
}
