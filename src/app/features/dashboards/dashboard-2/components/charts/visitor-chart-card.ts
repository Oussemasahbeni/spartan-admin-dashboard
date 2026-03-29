import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

const SCOPE = { scope: 'dashboard/dashboard2', alias: 'dashboard2' };

interface VisitorChartTranslation {
  title: string;
  period: string;
  trendingText: string;
  description: string;
  series: {
    desktop: string;
    mobile: string;
    tablet: string;
    other: string;
  };
}

@Component({
  selector: 'adm-visitor-chart-card',
  imports: [NgApexchartsModule, HlmCardImports, HlmIconImports],
  providers: [
    provideTranslocoScope(SCOPE),
    provideIcons({
      lucideTrendingUp,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section hlmCard class="h-full w-full">
      <div hlmCardHeader class="text-center">
        <h3 hlmCardTitle class="text-base font-semibold">{{ visitorChart().title }}</h3>
        <p hlmCardDescription class="text-muted-foreground text-xs">{{ visitorChart().period }}</p>
      </div>

      <div hlmCardContent class="flex min-h-75 flex-1 items-center justify-center">
        <apx-chart
          [series]="chartOptions().series!"
          [chart]="chartOptions().chart!"
          [labels]="chartOptions().labels!"
          [colors]="chartOptions().colors!"
          [dataLabels]="chartOptions().dataLabels!"
          [legend]="chartOptions().legend!"
          [plotOptions]="chartOptions().plotOptions!"
          [stroke]="chartOptions().stroke!"
        />
      </div>

      <div hlmCardFooter class="flex flex-col items-center text-center">
        <div class="flex items-center justify-center gap-2 text-sm font-medium text-emerald-400">
          {{ visitorChart().trendingText }}
          <ng-icon hlmIcon name="lucideTrendingUp" size="sm" />
        </div>
        <p class="text-muted-foreground mt-1 text-sm">{{ visitorChart().description }}</p>
      </div>
    </section>
  `,
})
export class VisitorChartCard {
  // ==========================================
  // State
  // ==========================================

  private readonly _visitorChart = translateObjectSignal('visitorChart', {}, SCOPE);

  protected readonly visitorChart = computed(() => this._visitorChart() as Translation & VisitorChartTranslation);

  protected readonly chartOptions = computed<ApexOptions>(() => {
    const chart = this.visitorChart();

    return {
      series: [500, 300, 200, 125],
      labels: [chart.series.desktop, chart.series.mobile, chart.series.tablet, chart.series.other],
      chart: {
        type: 'donut',
        height: 320,
        background: 'transparent',
      },
      colors: [
        'var(--color-chart-azure)',
        'var(--color-chart-orange)',
        'var(--color-chart-teal)',
        'var(--color-chart-amber)',
      ],
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
                color: 'var(--foreground)',
                formatter(val: string) {
                  return val;
                },
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Visitors',
                fontSize: '14px',
                color: 'var(--muted-foreground)',
                formatter(w) {
                  return (
                    w.globals.seriesTotals
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .reduce((a: any, b: any) => {
                        return a + b;
                      }, 0)
                      .toLocaleString()
                  );
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
  });
}
