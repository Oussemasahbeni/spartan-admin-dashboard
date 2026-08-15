import { Component, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDownRight,
  lucideArrowUpRight,
  lucideCreditCard,
  lucideDownload,
  lucideFilter,
  lucideLayoutDashboard,
  lucideMoreHorizontal,
  lucideShoppingBag,
  lucideTrendingDown,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide';

import { STATIC_TRANSACTIONS } from '@core/mock/transactions.data';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

import { RevenueChartCard } from './components/charts/revenue-chart-card';
import { VisitorChartCard } from './components/charts/visitor-chart-card';
import { StatCard, StatCardData } from './components/stat-card/stat-card';
import { TransactionsTable } from './components/transactions-table/transactions-table';
import { Transaction } from './model/dashboard-2';

@Component({
  selector: 'adm-dashboard-2',
  imports: [
    HlmButtonImports,
    NgIcon,
    HlmBadgeImports,
    TransactionsTable,
    RevenueChartCard,
    VisitorChartCard,
    StatCard,
    TranslocoModule,
  ],
  providers: [
    provideIcons({
      lucideFilter,
      lucideDownload,
      lucideShoppingBag,
      lucideMoreHorizontal,
      lucideArrowUpRight,
      lucideArrowDownRight,
      lucideLayoutDashboard,
      lucideTrendingUp,
      lucideTrendingDown,
      lucideUsers,
      lucideCreditCard,
    }),
  ],
  templateUrl: './dashboard-2.html',
})
export default class Dashboard2 {
  // ==========================================
  // State
  // ==========================================

  protected readonly transactions = signal<Transaction[]>(structuredClone(STATIC_TRANSACTIONS));

  protected readonly statCards = signal<StatCardData[]>([
      {
        icon: 'lucideShoppingBag',
        labelKey: 'totalSales.label',
        value: '$4,523,189',
        changePercent: '+20.1%',
        changeDescriptionKey: 'totalSales.changeDescription',
        isPositive: true,
      },
      {
        icon: 'lucideLayoutDashboard',
        labelKey: 'totalOrders.label',
        value: '12,545',
        changePercent: '+10.2%',
        changeDescriptionKey: 'totalOrders.changeDescription',
        isPositive: true,
      },
      {
        icon: 'lucideUsers',
        labelKey: 'totalVisitors.label',
        value: '8,344',
        changePercent: '-14.2%',
        changeDescriptionKey: 'totalVisitors.changeDescription',
        isPositive: false,
      },
      {
        icon: 'lucideCreditCard',
        labelKey: 'refunded.label',
        value: '3,148',
        changePercent: '+12.6%',
        changeDescriptionKey: 'refunded.changeDescription',
        isPositive: true,
      },
  ]);
}
