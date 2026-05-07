import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { translateObjectSignal, TranslocoModule } from '@jsverse/transloco';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

interface TrafficSourceCardTranslation {
  google: string;
  social: string;
  direct: string;
}

@Component({
  selector: 'adm-traffic-source-card',
  imports: [HlmCardImports, HlmTabsImports, NgApexchartsModule, TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.trafficSourceCard'" hlmCard class="h-full w-full">
      <hlm-tabs class="w-auto" [tab]="selectedPeriod()" (tabActivated)="selectedPeriod.set($event)">
        <header hlmCardHeader class="flex flex-row items-start justify-between gap-2">
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

        <main hlmCardContent class="mt-4" [hlmTabsContent]="selectedPeriod()">
          <apx-chart
            [grid]="chartOptions().grid!"
            [series]="chartOptions().series!"
            [chart]="chartOptions().chart!"
            [plotOptions]="chartOptions().plotOptions!"
            [legend]="chartOptions().legend!"
            [xaxis]="chartOptions().xaxis!"
            [yaxis]="chartOptions().yaxis!"
            [colors]="chartOptions().colors!"
          />
        </main>
      </hlm-tabs>
    </section>
  `,
})
export class TrafficSourceCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);

  // ==========================================
  // State
  // ==========================================

  protected readonly rtl = this._dir.isRtl;
  protected readonly selectedPeriod = signal<string>('month');

  private readonly _trafficCard = translateObjectSignal('analytics.trafficSourceCard.sources');

  protected readonly trafficCard = computed(() => this._trafficCard() as TrafficSourceCardTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const t = this.trafficCard();
    const isRtl = this.rtl();

    const categories = [t.google, t.social, t.direct];
    const monthData = [186, 305, 237];
    const weekData = [62, 102, 79];
    const data = this.selectedPeriod() === 'month' ? monthData : weekData;

    return {
      grid: {
        show: false,
      },
      series: [
        {
          name: 'Traffic',
          data: isRtl ? [...data].reverse() : data,
        },
      ],
      chart: {
        type: 'bar',
        height: 180,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '50%',
          borderRadius: 4,
          distributed: true,
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: isRtl ? [...categories].reverse() : categories,
        reversed: isRtl,
        labels: {
          show: true,
          style: { colors: 'var(--muted-foreground)', fontSize: '12px' },
          formatter: (val: string) => `${Number(val) / 1000}k`,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        max: 350,
      },
      yaxis: {
        reversed: isRtl,
        labels: {
          style: { colors: 'var(--muted-foreground)', fontSize: '12px' },
        },
      },
      colors: ['var(--color-chart-azure)', 'var(--color-chart-teal)', 'var(--color-chart-orange)'],
    };
  });
}
