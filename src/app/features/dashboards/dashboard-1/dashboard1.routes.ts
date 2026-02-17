import { Routes } from '@angular/router';
import { AnalyticsDashboard } from './analytics/analytics';
import { OverviewDashboard } from './overview/overview';
export default [
  {
    path: '',
    loadComponent: () => import('./layout'),
    children: [
      { path: 'overview', component: OverviewDashboard },
      { path: 'analytics', component: AnalyticsDashboard },
    ],
  },
] as Routes;
