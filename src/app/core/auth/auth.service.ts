import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '@core/config/tokens';
import { User } from '../../shared/models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _router = inject(Router);
  private readonly _localStorage = inject(LOCAL_STORAGE);

  private readonly _currentUser = signal<User | null>(null);
  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this._currentUser());

  setUser(user: User): void {
    this._currentUser.set(user);
  }

  logout(): Promise<boolean> {
    this._currentUser.set(null);
    this._localStorage?.removeItem('token');
    return this._router.navigate(['/login']);
  }
}
