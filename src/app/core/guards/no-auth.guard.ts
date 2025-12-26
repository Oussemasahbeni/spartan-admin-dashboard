import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user/user.service';

export const noAuthGuard: CanActivateFn = (_route, _state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.user()) {
    return router.parseUrl('/');
  }

  const token = localStorage.getItem('token');
  if (token) {
    return router.parseUrl('/');
  }

  return true;
};
