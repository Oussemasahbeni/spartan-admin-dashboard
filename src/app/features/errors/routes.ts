import { Routes } from '@angular/router';

export default [
  {
    path: '404-not-found',
    title: 'notFound',
    pathMatch: 'full',
    loadComponent: () => import('./not-found/not-found'),
  },
  {
    path: '401-unauthorized',
    title: 'unauthorized',
    pathMatch: 'full',
    loadComponent: () => import('./unauthorized/unauthorized'),
  },
  {
    path: '503-service-unavailable',
    title: 'serviceUnavailable',
    pathMatch: 'full',
    loadComponent: () => import('./service-unavailable/service-unavailable'),
  },
] as Routes;
