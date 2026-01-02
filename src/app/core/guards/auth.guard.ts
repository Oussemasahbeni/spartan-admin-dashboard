import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/user/auth.service';
import { User } from '../../features/users/model/user';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) return true;

  const token = localStorage.getItem('token');
  if (token) {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatar: 'https://i.pravatar.cc/120?u=alicej',
      phoneNumber: '+1234567890',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2023-01-01T00:00:00Z'),
    };
    authService.setUser(user);
    return true;
  }

  return router.parseUrl('/login');
};
