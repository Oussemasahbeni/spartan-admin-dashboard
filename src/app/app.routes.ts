import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/app/layout';
import { EmptyLayout } from './layout/empty/empty';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/dashboard-1',
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
        path: 'reset-password',
        title: 'resetPassword',
        component: EmptyLayout,
        loadChildren: () => import('./features/auth/reset-password/reset-password.routes'),
      },
      {
        path: 'two-step-verification',
        title: 'twoStepVerification',
        component: EmptyLayout,
        loadChildren: () => import('./features/auth/two-step-verification/two-step-verification.routes'),
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
        data: { breadcrumb: 'navigation.dashboard' },
        children: [
          {
            path: '',
            redirectTo: 'dashboard-1',
            pathMatch: 'full',
          },
          {
            path: 'dashboard-1',
            title: 'dashboard-1',
            data: { breadcrumb: 'navigation.dashboard-1' },
            loadChildren: () => import('./features/dashboards/dashboard-1/dashboard1.routes'),
          },
          {
            path: 'dashboard-2',
            title: 'dashboard-2',
            data: { breadcrumb: 'navigation.dashboard-2' },
            loadChildren: () => import('./features/dashboards/dashboard-2/dashboards.routes'),
          },
        ],
      },

      {
        path: 'users',
        title: 'users',
        data: { breadcrumb: 'navigation.users' },
        providers: [provideTranslocoScope('users')],
        loadChildren: () => import('./features/users/users.routes'),
      },
      {
        path: 'assistant',
        title: 'aiAssistant',
        data: { breadcrumb: 'navigation.aiAssistant' },
        loadChildren: () => import('./features/ai-assistant/ai-assistant.routes'),
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
