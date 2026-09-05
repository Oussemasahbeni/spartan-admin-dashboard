import { Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { barY, ChartPoint, ChartTooltipContent, colorLegend, defineChart, group } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';

const SCOPE = { scope: 'dashboard/dashboard2', alias: 'dashboard2' };

interface RevenueChartTranslation {
  title: string;
  value: string;
  change: string;
  period: string;
  series: { desktop: string; mobile: string };
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
  series: string;
  value: number;
}

const formatUsd = (v: number) => `$ ${v}k`;

@Component({
  selector: 'adm-revenue-chart-card',
  imports: [HlmChartImports, HlmBadgeImports, HlmButtonImports, HlmCardImports, HlmDropdownMenuImports, NgIcon],
  providers: [provideTranslocoScope(SCOPE), provideIcons({ lucideMoreHorizontal, lucideTrendingUp })],
  template: `
    <section hlmCard class="h-full w-full">
      <div hlmCardHeader class="flex flex-row items-center justify-between">
        <div>
          <h3 hlmCardTitle class="text-base font-semibold">{{ revenueChart().title }}</h3>
          <div class="mt-1 flex items-center gap-2">
            <span class="text-2xl font-bold">{{ revenueChart().value }}</span>
            <span class="text-success flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs">
              <ng-icon class="text-success" name="lucideTrendingUp" />
              <span>{{ revenueChart().change }}</span>
            </span>
          </div>
        </div>
        <button type="button" hlmBtn variant="outline" size="sm" align="end" [hlmDropdownMenuTrigger]="periodMenu">
          {{ revenueChart().period }}
        </button>
        <ng-template #periodMenu>
          <hlm-dropdown-menu>
            <hlm-dropdown-menu-group>
              <button type="button" hlmDropdownMenuItem>{{ revenueChart().period }}</button>
              <button type="button" hlmDropdownMenuItem>Month</button>
            </hlm-dropdown-menu-group>
          </hlm-dropdown-menu>
        </ng-template>
      </div>

      <div hlmCardContent>
        <tanstack-chart hlmChart [options]="_chartOptions()" />
      </div>
    </section>
  `,
})
export class RevenueChartCard {
  private readonly _dir = inject(DirectionalityService);

  private readonly _revenueChart = translateObjectSignal('revenueChart', {}, SCOPE);
  private readonly _months = translateObjectSignal('months', {}, SCOPE);

  protected readonly revenueChart = computed(() => this._revenueChart() as Translation & RevenueChartTranslation);
  protected readonly months = computed(() => this._months() as Translation & MonthsTranslation);

  protected readonly _chartOptions = computed(() => {
    const m = this.months();
    const s = this.revenueChart().series;
    const labels = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const desktop = [44, 55, 57, 56, 61, 58];
    const mobile = [13, 23, 20, 8, 13, 27];

    let months = labels;
    if (this._dir.isRtl()) months = [...labels].reverse();

    const rows: Row[] = months.flatMap((month) => {
      const i = labels.indexOf(month);
      return [
        { month, series: s.desktop, value: desktop[i] },
        { month, series: s.mobile, value: mobile[i] },
      ];
    });

    return {
      definition: defineChart(
        {
          marks: [
            barY(rows, {
              id: 'revenue-bars',
              x: 'month',
              y: 'value',
              color: 'series',
              layout: group({ padding: 0.18 }),
              inset: 2,
              radius: 4,
            }),
          ],
          scales: {
            x: {
              scale: () => scaleBand<string>().padding(0.4),
              axis: { line: false, ticks: { size: 0, padding: 10 } },
            },
            y: {
              scale: scaleLinear,
              nice: true,
              grid: true,
              axis: { line: false, ticks: { size: 0, format: formatUsd } },
            },
          },
          color: {
            domain: [s.desktop, s.mobile],
            range: ['var(--chart-1)', 'var(--chart-2)'],
            legend: colorLegend({ placement: 'bottom', itemWidth: 90 }),
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
      ariaLabel: this.revenueChart().title,
      height: 280,
    };
  });

  private tooltipContent(points: readonly ChartPoint<Row, string, number>[]): ChartTooltipContent {
    return {
      title: points[0]?.xValue,
      rows: points.map((p) => ({
        label: p.datum.series,
        value: formatUsd(p.yValue),
        color: p.color,
      })),
    };
  }
}
