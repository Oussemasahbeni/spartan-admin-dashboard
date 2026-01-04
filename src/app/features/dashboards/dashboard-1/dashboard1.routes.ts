import { Routes } from '@angular/router';
import { AnalyticsDashboard } from './analytics/analytics';
import { Dashboard1Layout } from './layout';
import { OverviewDashboard } from './overview/overview';
export default [
  {
    path: '',
    component: Dashboard1Layout,
    children: [
      { path: 'overview', component: OverviewDashboard },
      { path: 'analytics', component: AnalyticsDashboard },
    ],
  },
] as Routes;
