import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '404-not-found',
    title: 'notFound',
    pathMatch: 'full',
    providers: [provideTranslocoScope('system')],
    loadComponent: () => import('./not-found/not-found'),
  },
  {
    path: '401-unauthorized',
    title: 'unauthorized',
    pathMatch: 'full',
    providers: [provideTranslocoScope('system')],
    loadComponent: () => import('./unauthorized/unauthorized'),
  },
  {
    path: '503-service-unavailable',
    title: 'serviceUnavailable',
    pathMatch: 'full',
    providers: [provideTranslocoScope('system')],
    loadComponent: () => import('./service-unavailable/service-unavailable'),
  },
] as Routes;
