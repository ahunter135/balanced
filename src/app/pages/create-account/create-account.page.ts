import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserRepositoryService } from 'src/app/repositories/user-repository.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { User } from 'src/app/types/firestore/user';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
  animations: [
    trigger('login', [
      state('focused', style({ color: '#00eabb' })),
      state('blurred', style({ color: '#666' })),
      transition('focused <=> blurred', [animate('0.1s')]),
    ]),

    trigger('createForm', [
      transition(':leave', [
        style({ position: 'fixed', width: '100%' }),
        animate('0.3s ease-in', style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('showPhrase', [
      transition(':leave', [
        animate('0.3s ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.3s 0.1s ease-out', style({ transform: 'translateX(0%)' })),
      ]),
    ]),
  ],
})
export class CreateAccountPage implements OnInit {
  /* Animation states */
  loginFocused: boolean = false;

  /* Switch from create account to show one-time phrase */
  state: 'create' | 'showphrase' = 'create';
  backupPhrase?: string;
  backupPhraseWords?: string[];
  user: any = {
    name: undefined,
    email: undefined,
    password: undefined,
  };
  createAccountUser?: User;

  constructor(
    private alertService: AlertService,
    public router: Router,
    public route: ActivatedRoute,
    private authService: AuthService,
    private cryptoService: CryptoService,
    private userRepository: UserRepositoryService
  ) {}

  ngOnInit() {}

  async signUp() {
    /* Verify if the user has filled all the fields */
    try {
      this.verifyUserValues();
    } catch (error: any) {
      this.alertService.createAndShowToast(error.message);
      return;
    }

    try {
      this.createAccountUser = await this.authService.createAccount(
        this.user.email,
        this.user.password,
        { name: this.user.name }
      );
    } catch (error: any) {
      this.alertService.createAndShowToast(error.message);
    }

    try {
      if (!this.cryptoService.surrogateKey) {
        throw new Error('Something went wrong');
      }
      this.authService.setRefreshTokenSurrogateKey(
        this.cryptoService.surrogateKey!
      );
    } catch (error: any) {
      this.panic();
      return;
    }
    this.showPhrase();
  }

  async navigateToLogin() {
    this.router.navigate(['../login'], {
      relativeTo: this.route,
    });
  }

  async showPhrase() {
    this.backupPhrase = this.cryptoService.generateBackupPhrase().toLowerCase();
    this.backupPhraseWords = this.backupPhrase.split('-');
    this.state = 'showphrase';
  }

  async doneShowingPhrase() {
    this.saveUserPhrase();
    this.router.navigateByUrl('');
  }

  private async saveUserPhrase() {
    if (
      !this.backupPhrase ||
      !this.cryptoService.surrogateKey ||
      !this.createAccountUser
    ) {
      // This should never happen
      this.panic();
      return;
    }
    try {
      const { surrogateKey, salt } =
        await this.cryptoService.getKDFSurrogateAndSaltFromSurrogateKey(
          this.backupPhrase,
          this.cryptoService.surrogateKey
        );
      await this.userRepository.update(this.createAccountUser.id!, {
        encryption_data: {
          surrogate_key_backup_phrase: surrogateKey,
          backup_phrase_kdf_salt: salt,
        },
      });
    } catch (error: any) {
      this.alertService.createAndShowToast(error.message);
    }
  }

  private verifyUserValues() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      throw new Error('Please fill all the fields');
    }
  }

  private panic() {
    this.alertService.createAndShowToast('Something went wrong');
    this.authService.logout();
    this.router.navigateByUrl('login');
  }
}
