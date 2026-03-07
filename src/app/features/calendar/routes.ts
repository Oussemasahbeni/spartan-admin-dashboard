import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope('calendar')],
    loadComponent: () => import('./pages/calendar'),
  },
] as Routes;
