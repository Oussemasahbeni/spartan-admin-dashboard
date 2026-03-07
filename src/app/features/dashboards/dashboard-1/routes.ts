import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
export default [
  {
    path: '',
    loadComponent: () => import('./layout'),
    providers: [provideTranslocoScope({ scope: 'dashboard/dashboard1', alias: 'dashboard1' })],
  },
] as Routes;
