import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { MainLayout } from './layout/app/layout';
import { EmptyLayout } from './layout/empty/empty';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAuthGuard],
    component: EmptyLayout,
    loadChildren: () => import('./features/auth/login/login.routes'),
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes'),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  {
    path: '404-not-found',
    pathMatch: 'full',
    component: EmptyLayout,
    loadChildren: () => import('./shared/pages/not-found/not-found.routes'),
  },
  { path: '**', redirectTo: '404-not-found' },
];
