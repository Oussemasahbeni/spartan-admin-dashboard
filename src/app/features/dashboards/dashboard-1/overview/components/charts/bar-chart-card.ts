import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

const SCOPE = { scope: 'dashboard/dashboard1', alias: 'dashboard1' };

interface BarChartTranslation {
  title: string;
  value: string;
  description: string;
  seriesName: string;
}

interface MonthsTranslation {
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
}

@Component({
  selector: 'adm-bar-chart-card',
  imports: [HlmCardImports, NgApexchartsModule],
  providers: [provideTranslocoScope(SCOPE)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="h-full w-full">
      <header hlmCardHeader>
        <h1 hlmCardTitle class="text-base font-semibold">{{ barChart().title }}</h1>
        <div class="text-3xl font-bold tracking-tight tabular-nums">{{ barChart().value }}</div>
        <p class="text-muted-foreground mt-1 text-sm">{{ barChart().description }}</p>
      </header>

      <main hlmCardContent class="space-y-4">
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
      </main>
    </section>
  `,
})
export class BarChartCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);
  private readonly rtl = this._dir.isRtl;

  // ==========================================
  // State
  // ==========================================

  private readonly _barChart = translateObjectSignal('barChart', {}, SCOPE);
  private readonly _months = translateObjectSignal('months', {}, SCOPE);

  protected readonly barChart = computed(() => this._barChart() as Translation & BarChartTranslation);
  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const m = this.months();
    const isRtl = this.rtl();
    const data = [120, 140, 110, 180, 150, 170, 130, 200, 160, 140, 190, 150];
    const categories = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun, m.jul, m.aug, m.sep, m.oct, m.nov, m.dec];

    return {
      grid: {
        borderColor: 'var(--color-border)',
      },
      series: [
        {
          name: this.barChart().seriesName,
          data: isRtl ? [...data].reverse() : data,
        },
      ],
      chart: {
        type: 'bar',
        height: 200,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 4,
          distributed: true,
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
        position: 'bottom',
        labels: {
          style: { colors: 'var(--muted-foreground)', fontSize: '12px' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        show: false,
        opposite: isRtl,
      },
      colors: ['var(--color-chart-teal)'],
    };
  });
}
