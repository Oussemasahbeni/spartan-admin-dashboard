import { Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { translateObjectSignal, TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { areaY, ChartPoint, ChartTooltipContent, d3Curve, defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { curveMonotoneX } from 'd3-shape';


interface MonthsTranslation {
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
}

interface Row {
  month: string;
  customers: number;
}

const COLOR = 'var(--chart-3)';

@Component({
  selector: 'adm-customers-card',
  imports: [HlmCardImports, HlmButtonImports, HlmChartImports, NgIcon, TranslocoModule],
  providers: [provideIcons({ lucideTrendingUp })],
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.customersCard'" hlmCard class="h-full w-full">
      <header hlmCardHeader class="flex flex-col items-start justify-between gap-2">
        <h1 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h1>
        <p hlmCardDescription>{{ t('description') }}</p>
      </header>

      <main hlmCardContent>
        <tanstack-chart hlmChart [options]="_chartOptions()" />
      </main>

      <footer hlmCardFooter class="flex items-center gap-2 text-sm">
        <ng-icon name="lucideTrendingUp" class="text-success" />
        <span class="text-success font-medium">{{ t('trendingText') }}</span>
      </footer>
    </section>
  `,
})
export class CustomersCard {
  private readonly _dir = inject(DirectionalityService);

  private readonly _months = translateObjectSignal('months');
  protected readonly months = computed(() => this._months() as MonthsTranslation);

  protected readonly _chartOptions = computed(() => {
    const m = this.months();
    const labels = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const values = [180, 220, 150, 300, 280, 350];

    let rows: Row[] = labels.map((month, i) => ({ month, customers: values[i] }));
    if (this._dir.isRtl()) rows = [...rows].reverse();

    return {
      definition: defineChart(
        {
          marks: [
            areaY(rows, { x: 'month', y: 'customers', fill: 'url(#customers-area)', curve: d3Curve(curveMonotoneX) }),
            lineY(rows, { x: 'month', y: 'customers', stroke: COLOR, strokeWidth: 3, curve: d3Curve(curveMonotoneX) }),
          ],
          scales: {
            x: {
              scale: scalePoint,
              axis: { line: false, ticks: { size: 0, padding: 10 } },
            },
            y: { scale: scaleLinear, nice: true, grid: false, axis: false },
          },
          gradients: [
            {
              id: 'customers-area',
              x1: 0, y1: 0, x2: 0, y2: 1,
              stops: [
                { offset: 0, color: COLOR, opacity: 0.5 },
                { offset: 1, color: COLOR, opacity: 0.1 },
              ],
            },
          ],
          theme: HLM_CHART_THEME,
        },
        {
          focus: 'group-x',
          tooltip: hlmChartTooltip({
            content: (points: readonly ChartPoint<Row, string, number>[]) => this.tooltipContent(points),
          }),
        },
      ),
      ariaLabel: 'Customers by month',
      height: 200,
    };
  });

  private tooltipContent(points: readonly ChartPoint<Row, string, number>[]): ChartTooltipContent {
    const p = points[0];
    if (!p) return { rows: [] };
    return {
      title: p.xValue,
      rows: [{ label: 'Customers', value: p.yValue.toLocaleString(), color: COLOR }],
    };
  }
}