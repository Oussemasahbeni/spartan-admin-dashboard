import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { translateObjectSignal, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
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
  selector: 'adm-customers-card',
  imports: [HlmCardImports, HlmButtonImports, HlmIconImports, NgApexchartsModule, TranslocoModule],
  providers: [provideIcons({ lucideTrendingUp })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.customersCard'" hlmCard class="h-full w-full">
      <header hlmCardHeader class="flex flex-col items-start justify-between gap-2">
        <h1 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h1>
        <p hlmCardDescription>{{ t('description') }}</p>
      </header>

      <main hlmCardContent>
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

      <footer hlmCardFooter class="flex items-center gap-2 text-sm">
        <ng-icon hlmIcon name="lucideTrendingUp" size="sm" class="text-success" />
        <span class="text-success font-medium">{{ t('trendingText') }}</span>
      </footer>
    </section>
  `,
})
export class CustomersCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);
  private readonly rtl = this._dir.isRtl;

  // ==========================================
  // State
  // ==========================================

  private readonly _months = translateObjectSignal('months');

  protected readonly months = computed(() => this._months() as MonthsTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const m = this.months();
    const isRtl = this.rtl();
    const categories = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const data = [180, 220, 150, 300, 280, 350];

    return {
      grid: {
        show: false,
      },
      series: [
        {
          name: 'Customers',
          data: isRtl ? [...data].reverse() : data,
        },
      ],
      chart: {
        type: 'area',
        height: 200,
        toolbar: { show: false },
        zoom: { enabled: false },
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
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
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
      colors: ['var(--color-chart-orange)'],
    };
  });
}
