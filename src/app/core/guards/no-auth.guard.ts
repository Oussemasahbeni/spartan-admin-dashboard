import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth.guard';

export const noAuthGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(authGuard);
  const router = inject(Router);

  if (authService.user()) {
    return router.parseUrl('/');
  }

  const token = localStorage.getItem('token');
  if (token) {
    return router.parseUrl('/');
  }

  return true;
};
