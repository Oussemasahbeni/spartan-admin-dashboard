import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/app/layout';
import { EmptyLayout } from './layout/empty/empty';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/overview',
    pathMatch: 'full',
  },
  {
    path: '',
    providers: [provideTranslocoScope('auth')],
    children: [
      {
        path: 'login',
        title: 'login',
        component: EmptyLayout,
        loadChildren: () => import('./features/auth/login/login.routes'),
      },
      {
        path: 'signup',
        title: 'signup',
        component: EmptyLayout,
        loadChildren: () => import('./features/auth/signup/signup.routes'),
      },
      {
        path: 'forgot-password',
        title: 'forgotPassword',
        component: EmptyLayout,
        loadChildren: () => import('./features/auth/forgot-password/forgot-password.routes'),
      },
    ],
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        title: 'dashboard',
        children: [
          {
            path: 'dashboard-2',
            title: 'dashboard-2',
            loadChildren: () => import('./features/dashboards/dashboard-2/dashboards.routes'),
          },
          {
            path: 'overview',
            title: 'overview',
            loadChildren: () => import('./features/dashboards/dashboard-1/dashboard1.routes'),
          },
        ],
      },

      {
        path: 'users',
        title: 'users',
        providers: [provideTranslocoScope('users')],
        loadChildren: () => import('./features/users/users.routes'),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  {
    path: '404-not-found',
    title: 'notFound',
    pathMatch: 'full',
    component: EmptyLayout,
    providers: [provideTranslocoScope('system')],
    loadChildren: () => import('./shared/pages/not-found/not-found.routes'),
  },
  {
    path: '401-unauthorized',
    title: 'unauthorized',
    pathMatch: 'full',
    component: EmptyLayout,
    providers: [provideTranslocoScope('system')],
    loadChildren: () => import('./shared/pages/unauthorized/unauthorized.routes'),
  },
  {
    path: '503-service-unavailable',
    title: 'serviceUnavailable',
    pathMatch: 'full',
    component: EmptyLayout,
    providers: [provideTranslocoScope('system')],
    loadChildren: () => import('./shared/pages/service-unavailable/service-unavailable.routes'),
  },
  { path: '**', redirectTo: '404-not-found' },
];
