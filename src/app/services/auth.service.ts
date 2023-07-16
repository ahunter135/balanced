import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

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

  currentAuthUser: Observable<User | null> = new Observable((observer) => {
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this._currentUserIdCached = user.uid;
      } else {
        this._currentUserIdCached = null;
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
    await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    );
  }

  async createAccount(email: string, password: string, other: CreateAccountOthers): Promise<FirestoreUser> {
    let newFirestoreUser: FirestoreUser = await this.createUserStuff(email, password, other);

    const defaultCategories: Category[] = getDefaultCategories();
    let categoryAddPromises: Promise<Category | undefined>[] = [];

    // Add categories to the user's doc
    for (let category of defaultCategories) {
      categoryAddPromises.push(this.categoryRepository.add(newFirestoreUser.id!, category, category.id));
    }
    await Promise.all(categoryAddPromises);
    return newFirestoreUser;
  }

  async logout(): Promise<void> {

  }

  async getCurrentAuthUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  private async createUserStuff(email: string, password: string, other: CreateAccountOthers): Promise<FirestoreUser> {
    const userSignUp = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );

    const newUser: FirestoreUser = {
      email,
      id: userSignUp.user.uid,
      subscribed: false,
      name: other.name,
    };

    await this.userRepository.add(newUser, newUser.id);
    return newUser;
  }
}
