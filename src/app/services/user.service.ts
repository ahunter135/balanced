import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UserRepositoryService } from '../repositories/user-repository.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  isPremium: boolean;

  constructor(
    private authService: AuthService,
    private userRepository: UserRepositoryService,
  ) {
    this.userRepository.currentFirestoreUser.subscribe((user) => {
      if (user)
        this.isPremium = user.subscribed;
    });
  }

  public async updatePremiumStatus(isPremium: boolean) {
    const user = await this.authService.getCurrentAuthUser();
    if(!user || !user.uid)
      return;
    this.isPremium = isPremium;
    this.userRepository.update(user.uid, {
      subscribed: isPremium,
      token: this.authService.userToken,
    });
  }

}
