import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./tasks'),
  },
] as Routes;
