import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '404-not-found',
    title: 'notFound',
    pathMatch: 'full',
    providers: [provideTranslocoScope('system')],
    loadComponent: () => import('./not-found'),
  },
  {
    path: '401-unauthorized',
    title: 'unauthorized',
    pathMatch: 'full',
    providers: [provideTranslocoScope('system')],
    loadComponent: () => import('./unauthorized'),
  },
  {
    path: '503-service-unavailable',
    title: 'serviceUnavailable',
    pathMatch: 'full',
    providers: [provideTranslocoScope('system')],
    loadComponent: () => import('./service-unavailable'),
  },
] as Routes;
