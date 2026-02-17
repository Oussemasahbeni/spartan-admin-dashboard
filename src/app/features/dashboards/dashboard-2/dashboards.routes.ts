import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./dashboard-2'),
  },
] as Routes;
