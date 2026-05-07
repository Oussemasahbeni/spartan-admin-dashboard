import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

const SCOPE = { scope: 'dashboard/dashboard2', alias: 'dashboard2' };

interface RevenueChartTranslation {
  title: string;
  value: string;
  change: string;
  period: string;
  series: {
    desktop: string;
    mobile: string;
  };
}

interface MonthsTranslation {
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
}

@Component({
  selector: 'adm-revenue-chart-card',
  imports: [NgApexchartsModule, HlmBadgeImports, HlmButtonImports, HlmCardImports, HlmDropdownMenuImports, HlmIconImports],
  providers: [
    provideTranslocoScope(SCOPE),
    provideIcons({
      lucideMoreHorizontal,
      lucideTrendingUp,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="h-full w-full">
      <div hlmCardHeader class="flex flex-row items-center justify-between space-y-0">
        <div>
          <h3 hlmCardTitle class="text-base font-semibold">{{ revenueChart().title }}</h3>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-2xl font-bold">{{ revenueChart().value }}</span>
            <span class="text-success flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs">
              <ng-icon hlmIcon class="text-success" name="lucideTrendingUp" size="xs" />
              <span>{{ revenueChart().change }}</span>
            </span>
          </div>
        </div>
        <button type="button" hlmBtn variant="outline" size="sm" align="end" [hlmDropdownMenuTrigger]="periodMenu">
          {{ revenueChart().period }}
        </button>
        <ng-template #periodMenu>
          <hlm-dropdown-menu>
            <hlm-dropdown-menu-group>
              <button type="button" hlmDropdownMenuItem>
                {{ revenueChart().period }}
              </button>
              <button type="button" hlmDropdownMenuItem>Month</button>
            </hlm-dropdown-menu-group>
          </hlm-dropdown-menu>
        </ng-template>
      </div>

      <div hlmCardContent>
        <apx-chart
          [series]="chartOptions().series!"
          [chart]="chartOptions().chart!"
          [dataLabels]="chartOptions().dataLabels!"
          [plotOptions]="chartOptions().plotOptions!"
          [yaxis]="chartOptions().yaxis!"
          [xaxis]="chartOptions().xaxis!"
          [grid]="chartOptions().grid!"
          [colors]="chartOptions().colors!"
          [legend]="chartOptions().legend!"
          [tooltip]="chartOptions().tooltip!"
          [stroke]="chartOptions().stroke!"
          [fill]="chartOptions().fill!"
        />
      </div>
    </section>
  `,
})
export class RevenueChartCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);
  private readonly rtl = this._dir.isRtl;

  // ==========================================
  // State
  // ==========================================

  private readonly _revenueChart = translateObjectSignal('revenueChart', {}, SCOPE);
  private readonly _months = translateObjectSignal('months', {}, SCOPE);

  protected readonly revenueChart = computed(() => this._revenueChart() as Translation & RevenueChartTranslation);
  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const m = this.months();
    const chart = this.revenueChart();
    const isRtl = this.rtl();
    const categories = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];

    const desktopData = [44, 55, 57, 56, 61, 58];
    const mobileData = [13, 23, 20, 8, 13, 27];

    return {
      grid: {
        borderColor: 'var(--color-border)',
        strokeDashArray: 4,
      },
      series: [
        {
          name: chart.series.desktop,
          data: isRtl ? [...desktopData].reverse() : desktopData,
        },
        {
          name: chart.series.mobile,
          data: isRtl ? [...mobileData].reverse() : mobileData,
        },
      ],
      chart: {
        type: 'bar',
        height: 280,
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
        categories: isRtl ? [...categories].reverse() : categories,
        reversed: isRtl,
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: 'var(--muted-foreground)' },
        },
      },
      yaxis: {
        opposite: isRtl,
        labels: {
          style: { colors: 'var(--muted-foreground)' },
          formatter: (value: number) => {
            return '$ ' + value + 'k';
          },
        },
      },
      fill: { opacity: 1 },
      colors: ['var(--color-chart-azure)', 'var(--color-chart-teal)'],
      legend: {
        position: 'bottom',
        labels: { colors: 'var(--foreground)' },
      },
      tooltip: {
        theme: 'dark',
      },
    };
  });
}
