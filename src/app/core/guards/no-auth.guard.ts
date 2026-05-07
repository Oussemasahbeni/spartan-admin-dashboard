import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { LOCAL_STORAGE } from '@core/config/tokens';

export const noAuthGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);
  const localStorage = inject(LOCAL_STORAGE);
  const router = inject(Router);

  if (authService.currentUser()) {
    return router.parseUrl('/');
  }

  const token = localStorage?.getItem('token');
  if (token) {
    return router.parseUrl('/');
  }

  return true;
};
