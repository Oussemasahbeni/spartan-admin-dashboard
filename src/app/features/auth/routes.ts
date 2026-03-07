import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: 'login',
    title: 'login',
    providers: [provideTranslocoScope('auth')],
    loadComponent: () => import('./login/login'),
  },
  {
    path: 'signup',
    title: 'signup',
    providers: [provideTranslocoScope('auth')],
    loadComponent: () => import('./signup/signup'),
  },
  {
    path: 'reset-password',
    title: 'resetPassword',
    providers: [provideTranslocoScope('auth')],
    loadComponent: () => import('./reset-password/reset-password'),
  },
  {
    path: 'two-step-verification',
    title: 'twoStepVerification',
    providers: [provideTranslocoScope('auth')],
    loadComponent: () => import('./two-step-verification/two-step-verification'),
  },
] as Routes;
