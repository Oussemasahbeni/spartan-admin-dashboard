import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { translateObjectSignal, Translation, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideTrendingDown, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
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
  selector: 'adm-visitors-card',
  imports: [HlmCardImports, HlmIconImports, HlmTabsImports, NgApexchartsModule, TranslocoModule],
  providers: [provideIcons({ lucideTrendingUp, lucideTrendingDown })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.visitorsCard'" hlmCard class="h-full w-full">
      <hlm-tabs [tab]="selectedPeriod()" (tabActivated)="selectedPeriod.set($event)">
        <header hlmCardHeader class="flex flex-row items-start justify-between">
          <div>
            <h1 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h1>
            <p hlmCardDescription>{{ t('description') }}</p>
          </div>

          <hlm-tabs-list *transloco="let t; prefix: 'dashboard1'">
            <button type="button" hlmTabsTrigger="month" [aria-label]="t('period.month')">
              {{ t('period.month') }}
            </button>
            <button type="button" hlmTabsTrigger="week" [aria-label]="t('period.week')">
              {{ t('period.week') }}
            </button>
          </hlm-tabs-list>
        </header>

        <div hlmCardContent class="flex flex-col gap-4 lg:flex-row" [hlmTabsContent]="selectedPeriod()">
          <!-- Metrics Panel -->
          <div class="flex flex-col justify-center gap-4 lg:w-1/3">
            <!-- New Visitors Metric -->
            <div class="bg-muted/50 rounded-lg border p-4">
              <span class="text-muted-foreground text-sm font-medium">{{ t('newVisitors') }}</span>
              <div class="mt-1 text-2xl font-bold">36,786</div>
              <div class="text-success mt-1 flex items-center gap-1 text-xs">
                <ng-icon hlmIcon name="lucideTrendingUp" size="xs" />
                <span>88.7% (+10)</span>
              </div>
            </div>

            <!-- Returning Visitors Metric -->
            <div class="bg-muted/50 rounded-lg border p-4">
              <span class="text-muted-foreground text-sm font-medium">{{ t('returning') }}</span>
              <div class="mt-1 text-2xl font-bold">467</div>
              <div class="text-destructive mt-1 flex items-center gap-1 text-xs">
                <ng-icon hlmIcon name="lucideTrendingDown" size="xs" />
                <span>8.5% (-6)</span>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <main class="flex-1">
            <apx-chart
              [grid]="chartOptions().grid!"
              [series]="chartOptions().series!"
              [chart]="chartOptions().chart!"
              [xaxis]="chartOptions().xaxis!"
              [yaxis]="chartOptions().yaxis!"
              [legend]="chartOptions().legend!"
              [fill]="chartOptions().fill!"
              [stroke]="chartOptions().stroke!"
              [dataLabels]="chartOptions().dataLabels!"
              [colors]="chartOptions().colors!"
            />
          </main>
        </div>
      </hlm-tabs>
    </section>
  `,
})
export class VisitorsCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);
  private readonly rtl = this._dir.isRtl;

  // ==========================================
  // State
  // ==========================================

  protected readonly selectedPeriod = signal<string>('week');

  private readonly _months = translateObjectSignal('months', {});

  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const m = this.months();
    const isRtl = this.rtl();
    const categories = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const data =
      this.selectedPeriod() === 'month'
        ? [20000, 35000, 25000, 40000, 30000, 45000]
        : [8000, 12000, 10000, 15000, 11000, 16000];

    return {
      grid: {
        show: false,
      },
      series: [
        {
          name: 'Visitors',
          data: isRtl ? [...data].reverse() : data,
        },
      ],
      chart: {
        type: 'area',
        height: 180,
        toolbar: { show: false },
        zoom: { enabled: false },
        sparkline: { enabled: false },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      yaxis: {
        show: false,
        opposite: isRtl,
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
      colors: ['var(--color-chart-teal)'],
    };
  });
}
