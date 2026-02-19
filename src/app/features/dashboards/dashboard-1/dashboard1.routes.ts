import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { AnalyticsDashboard } from './analytics/analytics';
import { OverviewDashboard } from './overview/overview';
export default [
  {
    path: '',
    loadComponent: () => import('./layout'),
    providers: [provideTranslocoScope({ scope: 'dashboard/dashboard1', alias: 'dashboard1' })],
    children: [
      { path: 'overview', component: OverviewDashboard },
      { path: 'analytics', component: AnalyticsDashboard },
    ],
  },
] as Routes;
