import { Component, computed, inject, signal } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { translateObjectSignal, TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideInfo, lucideTrendingDown, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { barY, ChartPoint, ChartTooltipContent, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';

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
  sales: number;
}

const COLOR = 'var(--chart-1)';
const formatK = (v: number) => `${v / 1000}k`;

@Component({
  selector: 'adm-sales-card',
  imports: [HlmCardImports, HlmChartImports, NgIcon, HlmTabsImports, HlmTooltipImports, TranslocoModule],
  providers: [provideIcons({ lucideInfo, lucideTrendingUp, lucideTrendingDown })],
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.salesCard'" hlmCard class="h-full w-full">
      <hlm-tabs [tab]="selectedPeriod()" (tabActivated)="selectedPeriod.set($event)">
        <header hlmCardHeader class="flex flex-row items-start justify-between">
          <div>
            <h1 hlmCardTitle class="text-base font-semibold">{{ t('title') }}</h1>
            <p hlmCardDescription>{{ t('description') }}</p>
          </div>

          <hlm-tabs-list *transloco="let t; prefix: 'dashboard1'">
            <button type="button" hlmTabsTrigger="month">{{ t('period.month') }}</button>
            <button type="button" hlmTabsTrigger="week">{{ t('period.week') }}</button>
          </hlm-tabs-list>
        </header>

        <main hlmCardContent class="flex flex-col gap-6 lg:flex-row" [hlmTabsContent]="selectedPeriod()">
          <div class="flex flex-col justify-center gap-4 lg:w-1/3">
            <div class="bg-muted/50 rounded-lg border p-4">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-muted-foreground text-sm font-medium">{{ t('netSales') }}</span>
                <ng-icon name="lucideInfo" class="text-muted-foreground" hlmTooltip="Net sales information" />
              </div>
              <div class="text-2xl font-bold">$4,567,820</div>
              <div class="text-success mt-1 flex items-center gap-1 text-xs">
                <ng-icon name="lucideTrendingUp" />
                <span>24.5% (+10)</span>
              </div>
            </div>

            <div class="bg-muted/50 rounded-lg border p-4">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-muted-foreground text-sm font-medium">{{ t('orders') }}</span>
                <ng-icon name="lucideInfo" class="text-muted-foreground" hlmTooltip="Orders information" />
              </div>
              <div class="text-2xl font-bold">1,246</div>
              <div class="text-destructive mt-1 flex items-center gap-1 text-xs">
                <ng-icon name="lucideTrendingDown" />
                <span>8.5% (-15)</span>
              </div>
            </div>
          </div>

          <div class="flex-1">
            <tanstack-chart hlmChart [options]="_chartOptions()" />
          </div>
        </main>
      </hlm-tabs>
    </section>
  `,
})
export class SalesCard {
  private readonly _dir = inject(DirectionalityService);

  protected readonly selectedPeriod = signal<string>('month');

  private readonly _months = translateObjectSignal('months', {});
  protected readonly months = computed(() => this._months() as MonthsTranslation);

  protected readonly _chartOptions = computed(() => {
    const m = this.months();
    const labels = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const values =
      this.selectedPeriod() === 'month'
        ? [220000, 180000, 270000, 200000, 320000, 140000]
        : [80000, 90000, 70000, 60000, 110000, 50000];

    let rows: Row[] = labels.map((month, i) => ({ month, sales: values[i] }));
    if (this._dir.isRtl()) rows = [...rows].reverse();

    return {
      definition: defineChart(
        {
          marks: [
            barY(rows, {
              id: 'sales-bars',
              x: 'month',
              y: 'sales',
              key: 'month',
              radius: 4,
              fill: COLOR,
            }),
          ],
          scales: {
            x: {
              scale: () => scaleBand<string>().padding(0.5),
              axis: { line: false, ticks: { size: 0, padding: 10 } },
            },
            y: {
              scale: scaleLinear,
              nice: true,
              grid: true,
              axis: { line: false, ticks: { size: 0, format: formatK } },
            },
          },
          theme: HLM_CHART_THEME,
        },
        {
          focus: 'group-x',
          tooltip: hlmChartTooltip({
            content: (points: readonly ChartPoint<Row, string, number>[]) => this.tooltipContent(points),
          }),
        },
      ),
      ariaLabel: 'Sales by month',
      height: 220,
    };
  });

  private tooltipContent(points: readonly ChartPoint<Row, string, number>[]): ChartTooltipContent {
    const p = points[0];
    if (!p) return { rows: [] };
    return {
      title: p.xValue,
      rows: [{ label: 'Sales', value: p.yValue.toLocaleString(), color: COLOR }],
    };
  }
}