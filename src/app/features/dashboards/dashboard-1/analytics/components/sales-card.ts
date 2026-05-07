import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { translateObjectSignal, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideTrendingDown, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

interface MonthsTranslation {
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
}

@Component({
  selector: 'adm-sales-card',
  imports: [HlmCardImports, HlmIconImports, HlmTabsImports, HlmTooltipImports, NgApexchartsModule, TranslocoModule],
  providers: [provideIcons({ lucideInfo, lucideTrendingUp, lucideTrendingDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.salesCard'" hlmCard class="h-full w-full">
      <hlm-tabs [tab]="selectedPeriod()" (tabActivated)="selectedPeriod.set($event)">
        <header hlmCardHeader class="flex flex-row items-start justify-between">
          <div>
            <h1 hlmCardTitle class="text-base font-semibold">{{ t('title') }}</h1>
            <p hlmCardDescription>{{ t('description') }}</p>
          </div>

          <hlm-tabs-list *transloco="let t; prefix: 'dashboard1'">
            <button type="button" hlmTabsTrigger="month">
              {{ t('period.month') }}
            </button>
            <button type="button" hlmTabsTrigger="week">
              {{ t('period.week') }}
            </button>
          </hlm-tabs-list>
        </header>

        <main hlmCardContent class="flex flex-col gap-6 lg:flex-row" [hlmTabsContent]="selectedPeriod()">
          <!-- Metrics Panel -->
          <div class="flex flex-col justify-center gap-4 lg:w-1/3">
            <!-- Net Sales Metric -->
            <div class="bg-muted/50 rounded-lg border p-4">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-muted-foreground text-sm font-medium">{{ t('netSales') }}</span>
                <ng-icon
                  hlmIcon
                  name="lucideInfo"
                  size="sm"
                  class="text-muted-foreground"
                  hlmTooltip="Net sales information"
                />
              </div>
              <div class="text-2xl font-bold">$4,567,820</div>
              <div class="text-success mt-1 flex items-center gap-1 text-xs">
                <ng-icon hlmIcon name="lucideTrendingUp" size="xs" />
                <span>24.5% (+10)</span>
              </div>
            </div>

            <!-- Orders Metric -->
            <div class="bg-muted/50 rounded-lg border p-4">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-muted-foreground text-sm font-medium">{{ t('orders') }}</span>
                <ng-icon hlmIcon name="lucideInfo" size="sm" class="text-muted-foreground" hlmTooltip="Orders information" />
              </div>
              <div class="text-2xl font-bold">1,246</div>
              <div class="text-destructive mt-1 flex items-center gap-1 text-xs">
                <ng-icon hlmIcon name="lucideTrendingDown" size="xs" />
                <span>8.5% (-15)</span>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <div class="flex-1">
            <apx-chart
              [grid]="chartOptions().grid!"
              [series]="chartOptions().series!"
              [chart]="chartOptions().chart!"
              [plotOptions]="chartOptions().plotOptions!"
              [dataLabels]="chartOptions().dataLabels!"
              [legend]="chartOptions().legend!"
              [xaxis]="chartOptions().xaxis!"
              [yaxis]="chartOptions().yaxis!"
              [colors]="chartOptions().colors!"
            />
          </div>
        </main>
      </hlm-tabs>
    </section>
  `,
})
export class SalesCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);

  // ==========================================
  // State
  // ==========================================

  private readonly rtl = this._dir.isRtl;

  protected readonly selectedPeriod = signal<string>('month');

  private readonly _months = translateObjectSignal('months', {});

  protected readonly months = computed(() => this._months() as MonthsTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const m = this.months();
    const isRtl = this.rtl();
    const categories = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const data =
      this.selectedPeriod() === 'month'
        ? [220000, 180000, 270000, 200000, 320000, 140000]
        : [80000, 90000, 70000, 60000, 110000, 50000];

    return {
      grid: {
        borderColor: 'var(--color-border)',
        strokeDashArray: 4,
      },
      series: [
        {
          name: 'Sales',
          data: isRtl ? [...data].reverse() : data,
        },
      ],
      chart: {
        type: 'bar',
        height: 220,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: isRtl ? [...categories].reverse() : categories,
        reversed: isRtl,
        labels: {
          style: { colors: 'var(--muted-foreground)', fontSize: '12px' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        show: true,
        opposite: isRtl,
        labels: {
          style: { colors: 'var(--muted-foreground)', fontSize: '12px' },
          formatter: (val: number) => `${val / 1000}k`,
        },
      },
      colors: ['var(--color-chart-azure)'],
    };
  });
}
