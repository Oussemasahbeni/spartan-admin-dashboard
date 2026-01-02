import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
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

import { faker } from '@faker-js/faker';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TransactionsTableComponent } from './components/transactions-table/transactions-table';
import { ChartOptions, Transaction } from './model/dashboard-2';
import { provideTransactionStatusIcons } from './pipes/status-ui.pipe';

@Component({
  selector: 'adm-dashboard-2',
  imports: [NgApexchartsModule, HlmButtonImports, HlmIconImports, HlmBadgeImports, TransactionsTableComponent],
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
// TODO: Update the colors of the charts to better match the overall theme
// TODO: Add more interactivity to the dashboard elements
export class Dashboard2 implements OnInit {
  readonly transactions = signal<Transaction[]>([]);
  public revenueChartOptions: Partial<ChartOptions> | any = {
    series: [
      {
        name: 'Desktop',
        data: [44, 55, 57, 56, 61, 58],
      },
      {
        name: 'Mobile',
        data: [13, 23, 20, 8, 13, 27],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
      fontFamily: 'inherit',
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#94a3b8' },
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8' },
        formatter: (value: number) => {
          return '$ ' + value + 'k';
        },
      },
    },
    grid: {
      borderColor: '#1e293b',
      strokeDashArray: 4,
    },
    fill: { opacity: 1 },
    colors: ['#3b82f6', '#10b981'],
    legend: {
      position: 'bottom',
      labels: { colors: '#cbd5e1' },
    },
    tooltip: {
      theme: 'dark',
    },
  };

  public donutChartOptions: Partial<ChartOptions> | any = {
    series: [500, 300, 200, 125],
    labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
    chart: {
      type: 'donut',
      height: 320,
      background: 'transparent',
    },
    colors: ['#3b82f6', '#f43f5e', '#10b981', '#f59e0b'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#f8fafc',
              formatter: function (val: string) {
                return val;
              },
            },
            total: {
              show: true,
              showAlways: true,
              label: 'Visitors',
              fontSize: '14px',
              color: '#94a3b8',
              formatter: function (w: any) {
                return w.globals.seriesTotals
                  .reduce((a: any, b: any) => {
                    return a + b;
                  }, 0)
                  .toLocaleString();
              },
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: { show: false },
    tooltip: { theme: 'dark' },
  };

  constructor() {}

  ngOnInit() {
    this.generateMockData();
  }

  generateMockData() {
    const data: Transaction[] = Array.from({ length: 5 }).map(() => ({
      id: faker.string.numeric(6),
      user: {
        name: faker.person.firstName(),
        email: faker.internet.email().toLowerCase(),
        avatar: faker.image.avatar(),
      },
      status: faker.helpers.arrayElement(['Suspended', 'New', 'Delete', 'Suspended']),
      date: `${faker.number.int({ min: 2, max: 59 })} min ago`,
      amount: `$${faker.finance.amount({ min: 10, max: 1000, dec: 2 })}`,
    }));

    this.transactions.set(data);
  }
}
