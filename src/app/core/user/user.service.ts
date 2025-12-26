import { Injectable, signal } from '@angular/core';
import { User } from '../../features/users/user.type';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

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
}
