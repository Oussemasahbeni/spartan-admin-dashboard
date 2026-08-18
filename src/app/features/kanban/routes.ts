import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope('kanban')],
    loadComponent: () => import('./pages/kanban'),
  },
] as Routes;
