import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope('users')],
    loadComponent: () => import('./pages/users'),
  },
] as Routes;
