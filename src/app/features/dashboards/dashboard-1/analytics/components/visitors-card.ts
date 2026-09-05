import { Component, computed, inject, signal } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { translateObjectSignal, Translation, TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingDown, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
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
  visitors: number;
}

const COLOR = 'var(--chart-2)';
const smooth = d3Curve(curveMonotoneX);

@Component({
  selector: 'adm-visitors-card',
  imports: [HlmCardImports, HlmChartImports, NgIcon, HlmTabsImports, TranslocoModule],
  providers: [provideIcons({ lucideTrendingUp, lucideTrendingDown })],
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.visitorsCard'" hlmCard class="h-full w-full">
      <hlm-tabs [tab]="selectedPeriod()" (tabActivated)="selectedPeriod.set($event)">
        <header hlmCardHeader class="flex flex-row items-start justify-between">
          <div>
            <h1 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h1>
            <p hlmCardDescription>{{ t('description') }}</p>
          </div>

          <hlm-tabs-list *transloco="let t; prefix: 'dashboard1'">
            <button type="button" hlmTabsTrigger="month" [aria-label]="t('period.month')">{{ t('period.month') }}</button>
            <button type="button" hlmTabsTrigger="week" [aria-label]="t('period.week')">{{ t('period.week') }}</button>
          </hlm-tabs-list>
        </header>

        <div hlmCardContent class="flex flex-col gap-4 lg:flex-row" [hlmTabsContent]="selectedPeriod()">
          <div class="flex flex-col justify-center gap-4 lg:w-1/3">
            <div class="bg-muted/50 rounded-lg border p-4">
              <span class="text-muted-foreground text-sm font-medium">{{ t('newVisitors') }}</span>
              <div class="mt-1 text-2xl font-bold">36,786</div>
              <div class="text-success mt-1 flex items-center gap-1 text-xs">
                <ng-icon name="lucideTrendingUp" />
                <span>88.7% (+10)</span>
              </div>
            </div>

            <div class="bg-muted/50 rounded-lg border p-4">
              <span class="text-muted-foreground text-sm font-medium">{{ t('returning') }}</span>
              <div class="mt-1 text-2xl font-bold">467</div>
              <div class="text-destructive mt-1 flex items-center gap-1 text-xs">
                <ng-icon name="lucideTrendingDown" />
                <span>8.5% (-6)</span>
              </div>
            </div>
          </div>

          <main class="flex-1">
            <tanstack-chart hlmChart [options]="_chartOptions()" />
          </main>
        </div>
      </hlm-tabs>
    </section>
  `,
})
export class VisitorsCard {
  private readonly _dir = inject(DirectionalityService);

  protected readonly selectedPeriod = signal<string>('week');

  private readonly _months = translateObjectSignal('months', {});
  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly _chartOptions = computed(() => {
    const m = this.months();
    const labels = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const values =
      this.selectedPeriod() === 'month'
        ? [20000, 35000, 25000, 40000, 30000, 45000]
        : [8000, 12000, 10000, 15000, 11000, 16000];

    let rows: Row[] = labels.map((month, i) => ({ month, visitors: values[i] }));
    if (this._dir.isRtl()) rows = [...rows].reverse();

    return {
      definition: defineChart(
        {
          marks: [
            areaY(rows, { x: 'month', y: 'visitors', key: 'month', fill: 'url(#visitors-area)', curve: smooth }),
            lineY(rows, { x: 'month', y: 'visitors', key: 'month', stroke: COLOR, strokeWidth: 2, curve: smooth }),
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
              id: 'visitors-area',
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
              stops: [
                { offset: 0, color: COLOR, opacity: 0.4 },
                { offset: 1, color: COLOR, opacity: 0.05 },
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
      ariaLabel: 'Visitors by month',
      height: 180,
    };
  });

  private tooltipContent(points: readonly ChartPoint<Row, string, number>[]): ChartTooltipContent {
    const p = points[0];
    if (!p) return { rows: [] };
    return {
      title: p.xValue,
      rows: [{ label: 'Visitors', value: p.yValue.toLocaleString(), color: COLOR }],
    };
  }
}
