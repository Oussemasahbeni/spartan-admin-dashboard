import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope('tasks')],
    loadComponent: () => import('./pages/tasks'),
  },
] as Routes;
