import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope({ scope: 'dashboard/dashboard2', alias: 'dashboard2' })],
    loadComponent: () => import('./dashboard-2'),
  },
] as Routes;
