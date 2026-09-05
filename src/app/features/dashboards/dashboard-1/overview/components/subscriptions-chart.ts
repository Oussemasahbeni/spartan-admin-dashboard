import { Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { barY, ChartPoint, ChartTooltipContent, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';

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

interface Row {
  month: string;
  subscriptions: number;
}

@Component({
  selector: 'adm-bar-chart-card',
  imports: [HlmCardImports, HlmChartImports],
  providers: [provideTranslocoScope(SCOPE)],
  template: `
    <section hlmCard class="h-full w-full">
      <header hlmCardHeader>
        <h1 hlmCardTitle class="text-base font-semibold">{{ barChart().title }}</h1>
        <div class="text-3xl font-bold tracking-tight tabular-nums">{{ barChart().value }}</div>
        <p class="text-muted-foreground mt-1 text-sm">{{ barChart().description }}</p>
      </header>

      <main hlmCardContent class="flex flex-col gap-4">
        <tanstack-chart hlmChart [options]="_chartOptions()" />
      </main>
    </section>
  `,
})
export class BarChartCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);

  // ==========================================
  // State
  // ==========================================

  private readonly _barChart = translateObjectSignal('barChart', {}, SCOPE);
  private readonly _months = translateObjectSignal('months', {}, SCOPE);

  protected readonly barChart = computed(() => this._barChart() as Translation & BarChartTranslation);
  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly _chartOptions = computed(() => {
    const m = this.months();
    const values = [120, 140, 110, 180, 150, 170, 130, 200, 160, 140, 190, 150];
    const labels = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun, m.jul, m.aug, m.sep, m.oct, m.nov, m.dec];

    let rows: Row[] = labels.map((month, i) => ({ month, subscriptions: values[i] }));
    if (this._dir.isRtl()) rows = [...rows].reverse();

    return {
      definition: defineChart(
        {
          marks: [
            barY(rows, {
              id: 'monthly-bars',
              x: 'month',
              y: 'subscriptions',
              radius: 4,
              fill: 'var(--chart-2)',
            }),
          ],
          scales: {
            x: {
              scale: () => scaleBand<string>().paddingInner(0.4).paddingOuter(0.2),
              axis: {
                line: false,
                ticks: { size: 0, padding: 10 },
              },
            },
            y: { scale: scaleLinear, nice: true, grid: true, axis: false },
          },
          theme: HLM_CHART_THEME,
        },
        {
          focus: 'group-x',
          tooltip: hlmChartTooltip({
            content: (points: readonly ChartPoint<Row, string, number>[]) => this.tooltipContent(points),
          }),
        }
      ),
      ariaLabel: 'Subscribers by month',
      ariaDescription: 'Subscriber totals for the year 2026.',
      height: 200,
    };
  });

  private tooltipContent(points: readonly ChartPoint<Row, string, number>[]): ChartTooltipContent {
    return {
      title: points[0]?.xValue,
      rows: points.map((p) => ({
        label: this.barChart().seriesName,
        value: p.yValue.toLocaleString(),
        color: p.color,
      })),
    };
  }
}
