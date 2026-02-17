import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./settings'),
  },
] as Routes;
