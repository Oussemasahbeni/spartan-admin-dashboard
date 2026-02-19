import { Routes } from '@angular/router';
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
    component: EmptyLayout,
    loadChildren: () => import('./features/auth/routes'),
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
        loadChildren: () => import('./features/users/users.routes'),
      },
      {
        path: 'calendar',
        title: 'calendar',
        data: { breadcrumb: 'navigation.calendar' },
        loadChildren: () => import('./features/calendar/calendar.routes'),
      },
      {
        path: 'settings',
        title: 'settings',
        data: { breadcrumb: 'navigation.settings' },
        loadChildren: () => import('./features/settings/settings.routes'),
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
    path: '',
    component: EmptyLayout,
    loadChildren: () => import('./features/errors/routes'),
  },

  { path: '**', redirectTo: '404-not-found' },
];
