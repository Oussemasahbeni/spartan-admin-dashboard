import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

const SCOPE = { scope: 'dashboard/dashboard1', alias: 'dashboard1' };

interface AreaChartTranslation {
  title: string;
  description: string;
  series: {
    mobile: string;
    desktop: string;
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
  selector: 'adm-area-chart-card',
  imports: [HlmCardImports, NgApexchartsModule],
  providers: [provideTranslocoScope(SCOPE)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="h-full w-full">
      <header hlmCardHeader>
        <h1 hlmCardTitle class="text-base font-semibold">{{ areaChart().title }}</h1>
        <p hlmCardDescription>{{ areaChart().description }}</p>
      </header>

      <main hlmCardContent class="w-full overflow-hidden">
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
    </section>
  `,
})
export class AreaChartCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);
  private readonly rtl = this._dir.isRtl;

  // ==========================================
  // State
  // ==========================================

  private readonly _areaChart = translateObjectSignal('areaChart', {}, SCOPE);
  private readonly _months = translateObjectSignal('months', {}, SCOPE);

  protected readonly areaChart = computed(() => this._areaChart() as Translation & AreaChartTranslation);
  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const m = this.months();
    const chart = this.areaChart();
    const isRtl = this.rtl();
    const categories = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];

    const mobileSeries = [80, 200, 120, 70, 130, 140];
    const desktopSeries = [180, 300, 240, 190, 209, 214];

    return {
      grid: {
        borderColor: 'var(--color-border)',
      },
      series: [
        {
          name: chart.series.mobile,
          data: isRtl ? mobileSeries.reverse() : mobileSeries,
        },
        {
          name: chart.series.desktop,
          data: isRtl ? desktopSeries.reverse() : desktopSeries,
        },
      ],
      chart: {
        type: 'area',
        height: 250,
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
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [20, 100, 100, 100],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      yaxis: {
        show: false,
        opposite: isRtl, // Move Y-axis to right in RTL
      },
      xaxis: {
        categories: isRtl ? categories.reverse() : categories,
        reversed: isRtl, // Reverse X-axis direction in RTL
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      colors: ['var(--color-chart-azure)', 'var(--color-chart-teal)'],
    };
  });
}
