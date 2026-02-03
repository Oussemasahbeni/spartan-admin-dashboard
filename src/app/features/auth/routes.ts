import { Routes } from '@angular/router';

export default [
  {
    path: 'login',
    title: 'login',
    loadComponent: () => import('./login/login'),
  },
  {
    path: 'signup',
    title: 'signup',
    loadComponent: () => import('./signup/signup'),
  },
  {
    path: 'reset-password',
    title: 'resetPassword',
    loadComponent: () => import('./reset-password/reset-password'),
  },
  {
    path: 'two-step-verification',
    title: 'twoStepVerification',
    loadComponent: () => import('./two-step-verification/two-step-verification'),
  },
] as Routes;
