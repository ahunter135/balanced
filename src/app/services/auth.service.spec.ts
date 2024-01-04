import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { User } from '../types/firestore/user';
import { User as AuthUser } from 'firebase/auth';

const TEST_ACCOUNT = {
  email: 'angulartests@test.com',
  password: 'Password222!',
  other: {
    name: 'Angular Tests',
  }
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AuthService] });
    service = TestBed.inject(AuthService);
  });

  it('#AuthService should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#createAccount should create an account', async (done: DoneFn) => {
    let user: User | undefined = undefined;
    try {
      user = await service.createAccount(TEST_ACCOUNT.email, TEST_ACCOUNT.password, TEST_ACCOUNT.other);
    }
    catch (error) {
      console.log(error);
    } finally {
      console.info('authService createAccount', user);
      expect(user).toBeDefined();
      done();
    }
  });

  it('#login should login', async (done: DoneFn) => {
    try {
      await service.login(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
    }
    catch (error) {
      console.log(error);
    } finally {
      expect(service.currentUserId).toBeDefined();
      done();
    }
  });

  it('#getCurrentAuthUser should return the current auth user', async (done: DoneFn) => {
    let user: AuthUser | null = null;
    try {
      user = await service.getCurrentAuthUser();
    } catch (error) {
      console.log(error);
    } finally {
      expect(user).toBeDefined();
      done();
    }
  });

});
