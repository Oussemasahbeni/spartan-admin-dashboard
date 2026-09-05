import { booleanAttribute, Component, computed, inject, input } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideGift,
  lucideInfo,
  lucideSubscript,
  lucideTrendingDown,
  lucideTrendingUp,
} from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

import { HLM_CHART_THEME, HlmChartImports } from '@spartan-ng/helm/chart';
import { defineChart, lineY } from '@tanstack/charts';
import { scaleLinear } from '@tanstack/charts/scales/linear';

@Component({
  selector: 'adm-metric-card',
  imports: [NgIcon, HlmLabelImports, HlmCardImports, HlmTooltipImports, TranslocoModule, HlmChartImports],
  providers: [
    provideIcons({
      lucideInfo,
      lucideTrendingUp,
      lucideTrendingDown,
      lucideSubscript,
      lucideArrowUpDown,
      lucideGift,
    }),
    provideTranslocoScope({ scope: 'dashboard/dashboard1', alias: 'dashboard1' }),
  ],

  template: `
    <section *transloco="let t; prefix: 'dashboard1.metricCard'" hlmCard class="h-full w-full py-4">
      <!-- Header -->
      <header hlmCardHeader class="flex flex-row items-center justify-between">
        <div class="flex items-center gap-2">
          <ng-icon [name]="icon()" />
          <h1 hlmCardTitle class="text-muted-foreground text-sm font-medium">{{ title() }}</h1>
        </div>

        <div hlmCardAction>
          <ng-icon name="lucideInfo" [hlmTooltip]="tooltip() ?? ''" />
        </div>
      </header>

      <!-- Content: The main metrics and the chart -->
      <main hlmCardContent class="flex items-end justify-between">
        <div>
          <div class="text-3xl font-bold tracking-tight tabular-nums">{{ value() }}</div>
          <p hlmCardDescription class="mt-1 text-xs font-medium">{{ description() }}</p>
        </div>

        <div class="h-12 w-24">
          <tanstack-chart hlmChart [options]="_sparkOptions()" />
        </div>
      </main>

      <!-- Footer -->
      <footer hlmCardFooter class="mt-auto flex items-center justify-between">
        <a href="#" class="text-foreground text-sm font-medium hover:underline">{{ t('details') }}</a>

        <div
          class="flex items-center gap-1 text-sm font-medium"
          [class.text-success]="trendUp()"
          [class.text-destructive]="!trendUp()"
        >
          <span>{{ trendValue() }}</span>
          <ng-icon class="fill-current" [name]="trendUp() ? 'lucideTrendingUp' : 'lucideTrendingDown'" />
        </div>
      </footer>
    </section>
  `,
})
export class OverviewMetricCard {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);
  private readonly rtl = this._dir.isRtl;

  // ==========================================
  // Inputs
  // ==========================================

  public readonly title = input.required<string>();
  public readonly tooltip = input<string>();
  public readonly value = input.required<string>();
  public readonly description = input.required<string>();
  public readonly icon = input.required<string>();
  public readonly chartData = input.required<number[]>();
  public readonly chartColor = input.required<string>();
  public readonly trendValue = input.required<string>();
  public readonly trendUp = input.required({ transform: booleanAttribute });

  // ==========================================
  // State
  // ==========================================

  protected readonly _sparkOptions = computed(() => {
    const rows = this.orderedChartData().map((value, i) => ({ i, value }));

    return {
      definition: defineChart({
        marks: [
          lineY(rows, {
            x: 'i',
            y: 'value',
            stroke: this.chartColor(),
            strokeWidth: 2,
          }),
        ],
        scales: {
          x: { scale: scaleLinear, axis: false },
          y: { scale: scaleLinear, axis: false, grid: false },
        },
        theme: HLM_CHART_THEME,
      }),
      ariaLabel: this.title(),
      height: 48,
    };
  });

  private readonly orderedChartData = computed(() => {
    const data = this.chartData();
    return this.rtl() ? [...data].reverse() : data;
  });
}
