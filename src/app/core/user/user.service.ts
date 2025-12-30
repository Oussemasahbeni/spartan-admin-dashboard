import { Injectable, signal } from '@angular/core';
import { delay, finalize, from, tap } from 'rxjs';
import { makeData } from './data';
import { User } from './user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  private readonly _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    this._isLoading.set(true);

    // Convert the Promise from makeData into an Observable
    from(makeData(200))
      .pipe(
        delay(1000),
        tap((data) => this._users.set(data)),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe({
        error: (err) => console.error('Failed to load mock data', err),
      });
  }
  setUser(user: User | null): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }

  updateUser(updatedUser: Partial<User>): void {
    this._users.update((users) => users.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
  }

  deleteUser(userId: string) {
    this._users.update((prev) => prev.filter((u) => u.id !== userId));
  }

  addUser(user: User) {
    this._users.update((users) => [user, ...users]);
  }
}
