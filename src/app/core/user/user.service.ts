import { Injectable, signal } from '@angular/core';
import { USER_DATA } from './data';
import { User } from './user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  private readonly _users = signal<User[]>(USER_DATA);
  readonly users = this._users.asReadonly();

  setUser(user: User | null): void {
    this._user.set(user);
  }

  clearUser(): void {
    this._user.set(null);
  }

  updateUser(updatedUser: Partial<User>): void {
    this._user.update((currentUser) => {
      if (currentUser) {
        return { ...currentUser, ...updatedUser };
      }
      return currentUser;
    });
  }

  deleteUser(userId: string) {
    this._users.update((prev) => prev.filter((u) => u.id !== userId));
  }
  addUser(user: User) {
    this._users.update((users) => [user, ...users]);
  }
}
