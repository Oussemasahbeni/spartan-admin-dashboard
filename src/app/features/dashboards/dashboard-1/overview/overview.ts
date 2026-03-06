import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { STATIC_PAYMENTS } from '@core/mock/payments.data';
import { STATIC_USERS } from '@core/mock/users.data';
import { TranslocoModule } from '@jsverse/transloco';
import { User } from '../../../../shared/models/user';
import { BarChartCard } from './components/charts/bar-chart-card';
import { AreaChartCard } from './components/charts/subscriptions-card';
import { CardVariant, OverviewMetricCard } from './components/metric-card';
import { PaymentsTable } from './components/table/payments-table';
import { TeamMembersCard } from './components/team-members-card';
import { Payment } from './model/payment';

export interface OverviewMetric {
  titleKey: string;
  tooltipKey?: string;
  value: string;
  descriptionKey: string;
  icon: string;
  chartData: number[];
  chartColor: string;
  trendValue: string;
  trendUp: boolean;
  variant: CardVariant;
}

@Component({
  selector: 'adm-dashboard1-overview',
  imports: [OverviewMetricCard, AreaChartCard, BarChartCard, PaymentsTable, TeamMembersCard, TranslocoModule],
  templateUrl: './overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewDashboard {
  // ==========================================
  // State
  // ==========================================

  readonly cards = signal<OverviewMetric[]>([
    {
      titleKey: 'overview.cards.newSubscriptions.title',
      tooltipKey: 'overview.cards.newSubscriptions.infoTooltip',
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
      tooltipKey: 'overview.cards.newOrders.infoTooltip',
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
      tooltipKey: 'overview.cards.avgOrderRevenue.infoTooltip',
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

  readonly payments = signal<Payment[]>(structuredClone(STATIC_PAYMENTS));

  readonly teamMembers = signal<User[]>(structuredClone(STATIC_USERS.slice(0, 8)));
}
