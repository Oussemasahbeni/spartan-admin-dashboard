import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./ai-assistant'),
  },
] as Routes;
