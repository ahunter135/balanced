import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User as AuthUser, UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

import { Category, User as FirestoreUser } from '../types/firestore/user';
import { UserRepositoryService } from '../repositories/user-repository.service';
import { CreateAccountOthers } from '../types/firestore/auth';
import { getDefaultCategories } from '../helpers/firestore/auth-helpers';
import { CategoryRepositoryService } from '../repositories/category-repository.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _currentUserIdCached: string | null;
  get currentUserId(): string | null { return this._currentUserIdCached; }

  currentAuthUser: Observable<AuthUser | null> = new Observable((observer) => {
    onAuthStateChanged(this.auth, (user: AuthUser | null) => {
      if (user) {
        this._currentUserIdCached = user.uid;
      } else {
        this._currentUserIdCached = null;
        /* Clear the cached user when the user logs out */
        this.userRepository.onUserLoggedOut();
      }
      observer.next(user);
    });
  });

  constructor(
    private auth: Auth,
    private userRepository: UserRepositoryService,
    private categoryRepository: CategoryRepositoryService,
  ) {
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
    } catch (error: any) {
      throw new Error("Email or password is incorrect");
    }
  }

  async createAccount(email: string, password: string, other: CreateAccountOthers): Promise<FirestoreUser> {
    let newFirestoreUser: FirestoreUser = await this.createUserStuff(email, password, other);

    const defaultCategories: Category[] = getDefaultCategories();
    let categoryAddPromises: Promise<Category | undefined>[] = [];

    // Add categories to the user's doc
    for (let category of defaultCategories) {
      categoryAddPromises.push(
        this.categoryRepository.add(newFirestoreUser.id!, category, category.id)
      );
    }
    await Promise.all(categoryAddPromises);
    return newFirestoreUser;
  }

  async logout(): Promise<Boolean> {
    try {
      await this.auth.signOut();
      this._currentUserIdCached = null;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getCurrentAuthUser(): Promise<AuthUser | null> {
    return this.auth.currentUser;
  }

  async deleteAuthUser(): Promise<void> {
    const user = await this.getCurrentAuthUser();
    if (user) {
      await user.delete();
      this._currentUserIdCached = null;
    }
  }

  private async createUserStuff(email: string, password: string, other: CreateAccountOthers): Promise<FirestoreUser> {
    /* Create auth user */
    let userSignUp: UserCredential;
    try {
      userSignUp = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
    } catch (error) {
      throw new Error("Something went wrong");
    }

    let newUser: FirestoreUser = {
      email,
      id: userSignUp.user.uid,
      subscribed: false,
      name: other.name,
    };

    let tmp: FirestoreUser | undefined;
    try {
      tmp = await this.userRepository.add(newUser, newUser.id);
    } catch (error) {
      /* Roll back auth user creation */
      await this.deleteAuthUser();
      throw new Error("Something went wrong");
    }
    if (tmp) newUser = tmp;
    else throw new Error("Failed to create user");
    if (newUser.id) this._currentUserIdCached = newUser.id;

    return newUser;
  }

}
