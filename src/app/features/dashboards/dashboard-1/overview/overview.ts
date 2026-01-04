import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { makePaymentData } from '@core/mock/payment';
import { makeUsersData } from '@core/mock/users';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { User } from '../../../users/model/user';
import { AreaChartCard } from './components/charts/area-chart-card';
import { BarChartCard } from './components/charts/bar-chart-card';
import { CardVariant, OverviewMetricCard } from './components/metric-card';
import { PaymentsTable, type Payment } from './components/table/payments-table';
import { TeamMembersCard } from './components/team-members-card';

export interface OverviewMetric {
  titleKey: string;
  value: string;
  descriptionKey: string;
  icon: string;
  chartData: number[];
  chartColor: string;
  trendValue: string;
  trendUp: boolean;
  variant: CardVariant;
}

const SCOPE = { scope: 'dashboard/dashboard1', alias: 'dashboard1' };

@Component({
  selector: 'adm-dashboard1-overview',
  imports: [OverviewMetricCard, AreaChartCard, BarChartCard, PaymentsTable, TeamMembersCard, TranslocoModule],
  templateUrl: './overview.html',
  providers: [provideTranslocoScope(SCOPE)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewDashboard {
  readonly cards = signal<OverviewMetric[]>([
    {
      titleKey: 'overview.cards.newSubscriptions.title',
      value: '4,682',
      descriptionKey: 'overview.cards.newSubscriptions.description',
      icon: 'lucideSubscript',
      chartData: [45, 75, 55, 85, 40, 70],
      chartColor: 'var(--color-chart-teal)',
      trendValue: '15.54%',
      trendUp: true,
      variant: 'compact',
    },
    {
      titleKey: 'overview.cards.newOrders.title',
      value: '1,226',
      descriptionKey: 'overview.cards.newOrders.description',
      icon: 'lucideArrowUpDown',
      chartData: [30, 45, 75, 25, 55, 55],
      chartColor: 'var(--color-destructive)',
      trendValue: '40.2%',
      trendUp: false,
      variant: 'compact',
    },
    {
      titleKey: 'overview.cards.avgOrderRevenue.title',
      value: '1,080',
      descriptionKey: 'overview.cards.avgOrderRevenue.description',
      icon: 'lucideGift',
      chartData: [35, 55, 40, 65, 50, 85],
      chartColor: 'var(--color-chart-teal)',
      trendValue: '10.8%',
      trendUp: true,
      variant: 'compact',
    },
    {
      titleKey: 'overview.cards.totalRevenue.title',
      value: '$15,231.89',
      descriptionKey: 'overview.cards.totalRevenue.description',
      icon: '',
      chartData: [30, 40, 35, 30, 25, 35, 40, 80],
      chartColor: 'var(--foreground)',
      trendValue: '',
      trendUp: true,
      variant: 'large',
    },
  ]);

  readonly payments = signal<Payment[]>(makePaymentData(30));

  readonly teamMembers = signal<User[]>(makeUsersData(6));
}
