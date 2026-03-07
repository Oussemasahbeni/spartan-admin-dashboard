import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./pages/tasks'),
  },
] as Routes;
