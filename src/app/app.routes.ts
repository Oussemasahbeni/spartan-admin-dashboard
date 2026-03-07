import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/app/layout';
import { EmptyLayout } from './layout/empty/empty';
import { provideTranslocoScope } from '@jsverse/transloco';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard/dashboard-1',
    pathMatch: 'full',
  },
  {
    path: '',
    component: EmptyLayout,
    loadChildren: () => import('./features/auth/routes'),
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
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
            loadChildren: () => import('./features/dashboards/dashboard-1/routes'),
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
        loadChildren: () => import('./features/users/routes'),
      },
      {
        path: 'calendar',
        title: 'calendar',
        data: { breadcrumb: 'navigation.calendar' },
        loadChildren: () => import('./features/calendar/routes'),
      },
      {
        path: 'tasks',
        title: 'tasks',
        data: { breadcrumb: 'navigation.tasks' },
        providers: [provideTranslocoScope('tasks')],
        loadChildren: () => import('./features/tasks/routes'),
      },
      {
        path: 'settings',
        title: 'settings',
        data: { breadcrumb: 'navigation.settings' },
        loadChildren: () => import('./features/settings/routes'),
      },
      {
        path: 'assistant',
        title: 'aiAssistant',
        data: { breadcrumb: 'navigation.aiAssistant' },
        loadChildren: () => import('./features/ai-assistant/routes'),
      },
    ],
  },

  {
    path: '',
    component: EmptyLayout,
    loadChildren: () => import('./features/errors/routes'),
  },

  { path: '**', redirectTo: '404-not-found' },
];
