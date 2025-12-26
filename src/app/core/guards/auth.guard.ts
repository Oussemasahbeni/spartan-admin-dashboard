import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../../features/users/user.type';
import { UserService } from '../user/user.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.user()) return true;

  const token = localStorage.getItem('token');
  if (token) {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatar: 'https://i.pravatar.cc/120?u=johndoe',
      phoneNumber: '+1234567890',
      role: 'admin',
      status: 'active',
      createdAt: new Date('2023-01-01T00:00:00Z'),
    };
    userService.setUser(user);
    return true;
  }

  return router.parseUrl('/login');
};
