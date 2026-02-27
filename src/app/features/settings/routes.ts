import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope('settings')],
    loadComponent: () => import('./settings'),
  },
] as Routes;
