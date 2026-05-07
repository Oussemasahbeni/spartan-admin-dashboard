import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
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
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { RevenueChartCard } from './components/charts/revenue-chart-card';
import { VisitorChartCard } from './components/charts/visitor-chart-card';
import { FilterDialogComponent, FilterOptions } from './components/filter-dialog/filter-dialog';
import { StatCardComponent, StatCardData } from './components/stat-card/stat-card';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table';
import { Transaction } from './model/dashboard-2';
import { provideTransactionStatusIcons } from './pipes/status-ui.pipe';

@Component({
  selector: 'adm-dashboard-2',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmBadgeImports,
    TransactionsTableComponent,
    RevenueChartCard,
    VisitorChartCard,
    StatCardComponent,
    TranslocoModule,
    FilterDialogComponent,
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
    provideTransactionStatusIcons(),
  ],
  templateUrl: './dashboard-2.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Dashboard2 implements OnInit {
  // ==========================================
  // State
  // ==========================================

  protected readonly transactions = signal<Transaction[]>([]);
  protected readonly statCards = signal<StatCardData[]>([]);
  protected readonly activeFilters = signal<FilterOptions | null>(null);

  // ==========================================
  // Public Methods
  // ==========================================

  ngOnInit() {
    this.transactions.set(structuredClone(STATIC_TRANSACTIONS));
    this.generateStatCards();
  }

  generateStatCards() {
    this.statCards.set([
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

  // ==========================================
  // Private Methods
  // ==========================================

  onFilterApplied(filters: FilterOptions) {
    this.activeFilters.set(filters);
    // In a real application, you would filter the data here
    console.log('Filters applied:', filters);
  }

  onStatCardMenuClick(cardLabel: string) {
    // Add interactivity - could open a menu, navigate, or show details
    console.log('Menu clicked for:', cardLabel);
  }

  onExportData() {
    // Export functionality - could export as CSV, PDF, etc.
    console.log('Exporting dashboard data...');
    const data = {
      transactions: this.transactions(),
      stats: this.statCards(),
      timestamp: new Date().toISOString(),
    };
    // In a real app, you would generate and download a file
    console.log('Data to export:', data);
  }
}
