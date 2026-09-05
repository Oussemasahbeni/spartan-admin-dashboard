import { Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { areaY, ChartPoint, ChartTooltipContent, d3Curve, defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { curveMonotoneX } from 'd3-shape';

const SCOPE = { scope: 'dashboard/dashboard1', alias: 'dashboard1' };

interface AreaChartTranslation {
  title: string;
  description: string;
  series: { mobile: string; desktop: string };
}

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
  mobile: number;
  desktop: number;
}

const MOBILE_COLOR = 'var(--chart-1)';
const DESKTOP_COLOR = 'var(--chart-2)';
const smooth = d3Curve(curveMonotoneX);

@Component({
  selector: 'adm-area-chart-card',
  imports: [HlmCardImports, HlmChartImports],
  providers: [provideTranslocoScope(SCOPE)],
  template: `
    <section hlmCard class="h-full w-full">
      <header hlmCardHeader>
        <h1 hlmCardTitle class="text-base font-semibold">{{ areaChart().title }}</h1>
        <p hlmCardDescription>{{ areaChart().description }}</p>
      </header>

      <main hlmCardContent class="w-full overflow-hidden">
        <tanstack-chart hlmChart [options]="_chartOptions()" />
      </main>
    </section>
  `,
})
export class AreaChartCard {
  private readonly _dir = inject(DirectionalityService);

  private readonly _areaChart = translateObjectSignal('areaChart', {}, SCOPE);
  private readonly _months = translateObjectSignal('months', {}, SCOPE);

  protected readonly areaChart = computed(() => this._areaChart() as Translation & AreaChartTranslation);
  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly _chartOptions = computed(() => {
    const m = this.months();
    const labels = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const mobile = [80, 200, 120, 70, 130, 140];
    const desktop = [180, 300, 240, 190, 209, 214];

    let rows: Row[] = labels.map((month, i) => ({ month, mobile: mobile[i], desktop: desktop[i] }));
    if (this._dir.isRtl()) rows = [...rows].reverse();

    return {
      definition: defineChart(
        {
          marks: [
            areaY(rows, { id: 'desktop-area', x: 'month', y: 'desktop', fill: 'url(#area-desktop)', curve: smooth }),
            lineY(rows, {
              id: 'desktop-line',
              x: 'month',
              y: 'desktop',
              stroke: DESKTOP_COLOR,
              strokeWidth: 2,
              curve: smooth,
            }),
            areaY(rows, { id: 'mobile-area', x: 'month', y: 'mobile', fill: 'url(#area-mobile)', curve: smooth }),
            lineY(rows, { id: 'mobile-line', x: 'month', y: 'mobile', stroke: MOBILE_COLOR, strokeWidth: 2, curve: smooth }),
          ],
          scales: {
            x: {
              scale: scalePoint,
              axis: { line: false, ticks: { size: 0, padding: 10 } },
            },
            y: { scale: scaleLinear, nice: true, grid: true, axis: false },
          },
          gradients: [
            {
              id: 'area-desktop',
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
              stops: [
                { offset: 0.2, color: DESKTOP_COLOR, opacity: 0.4 },
                { offset: 1, color: DESKTOP_COLOR, opacity: 0.1 },
              ],
            },
            {
              id: 'area-mobile',
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
              stops: [
                { offset: 0.2, color: MOBILE_COLOR, opacity: 0.4 },
                { offset: 1, color: MOBILE_COLOR, opacity: 0.1 },
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
        }
      ),
      ariaLabel: this.areaChart().title,
      height: 250,
    };
  });

  private tooltipContent(points: readonly ChartPoint<Row, string, number>[]): ChartTooltipContent {
    const s = this.areaChart().series;
    const lines = points.filter((p) => p.markId.endsWith('-line'));

    return {
      title: points[0]?.xValue,
      rows: lines.map((p) => ({
        label: p.markId === 'mobile-line' ? s.mobile : s.desktop,
        value: p.yValue.toLocaleString(),
        color: p.color,
      })),
    };
  }
}
