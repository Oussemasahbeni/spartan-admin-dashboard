import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./users-list'),
  },
] as Routes;
