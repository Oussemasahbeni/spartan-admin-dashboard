import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideGift,
  lucideInfo,
  lucideSubscript,
  lucideTrendingDown,
  lucideTrendingUp,
} from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

export type CardVariant = 'compact' | 'large';

@Component({
  selector: 'adm-metric-card',
  imports: [HlmIconImports, HlmLabelImports, HlmCardImports, HlmTooltipImports, TranslocoModule, NgApexchartsModule],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- New Subscriptions Card -->
    <section *transloco="let t; prefix: 'dashboard1.metricCard'" hlmCard class="h-full w-full py-4">
      @if (variant() === 'compact') {
        <!-- Header -->
        <div hlmCardHeader class="flex flex-row items-center justify-between">
          <div class="flex items-center gap-2">
            <ng-icon hlm size="sm" [name]="icon()" />
            <h3 hlmCardTitle class="text-muted-foreground text-sm font-medium">{{ title() }}</h3>
          </div>

          <div hlmCardAction>
            <ng-icon hlm name="lucideInfo" size="sm" [hlmTooltipTrigger]="tooltip() ?? ''" />
          </div>
        </div>

        <!-- Content: The main metrics and the chart -->
        <div hlmCardContent class="flex items-end justify-between">
          <div>
            <div class="text-3xl font-bold tracking-tight tabular-nums">{{ value() }}</div>
            <p hlmCardDescription class="mt-1 text-xs font-medium">{{ description() }}</p>
          </div>

          <div class="h-12 w-24">
            <apx-chart
              [series]="chartSeries()"
              [chart]="chartConfig().chart!"
              [stroke]="chartConfig().stroke!"
              [colors]="[chartColor()]"
              [tooltip]="chartConfig().tooltip!"
            />
          </div>
        </div>

        <!-- Footer -->
        <div hlmCardFooter class="mt-auto flex items-center justify-between">
          <a href="#" class="text-foreground text-sm font-medium hover:underline">{{ t('details') }}</a>

          <div
            class="flex items-center gap-1 text-sm font-medium"
            [class.text-success]="trendUp()"
            [class.text-destructive]="!trendUp()"
          >
            <span>{{ trendValue() }}</span>
            <ng-icon hlm class="fill-current" size="xs" [name]="trendUp() ? 'lucideTrendingUp' : 'lucideTrendingDown'" />
          </div>
        </div>
      }
      @if (variant() === 'large') {
        <div hlmCardContent class="px-6">
          <p class="text-muted-foreground text-sm font-medium">{{ title() }}</p>
          <div class="mt-2 text-3xl font-bold tracking-tight tabular-nums">{{ value() }}</div>
          <p class="text-muted-foreground mt-1 text-xs font-medium">{{ description() }}</p>
          <apx-chart
            class="w-full"
            [series]="chartSeries()"
            [chart]="chartOptions().chart!"
            [stroke]="chartOptions().stroke!"
            [markers]="chartOptions().markers!"
            [colors]="[chartColor()]"
            [tooltip]="chartOptions().tooltip!"
          />
        </div>
      }
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

  readonly variant = input<CardVariant>('compact');
  readonly title = input.required<string>();
  readonly tooltip = input<string>();
  readonly value = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input.required<string>();
  readonly chartData = input.required<number[]>();
  readonly chartColor = input.required<string>();
  readonly trendValue = input.required<string>();
  readonly trendUp = input.required<boolean>();

  // ==========================================
  // State
  // ==========================================

  readonly chartSeries = computed<ApexAxisChartSeries>(() => {
    const data = this.chartData();
    const isRtl = this.rtl();
    return [{ data: isRtl ? [...data].reverse() : data }];
  });

  readonly chartConfig = computed<ApexOptions>(() => ({
    chart: { type: 'line', height: 40, sparkline: { enabled: true }, animations: { enabled: false } },
    stroke: { curve: 'straight', width: 2 },
    tooltip: { enabled: false },
  }));

  readonly chartOptions = computed<ApexOptions>(() => {
    const isLarge = this.variant() === 'large';

    return {
      chart: {
        type: 'line',
        height: isLarge ? 80 : 40,
        sparkline: { enabled: true },
      },
      stroke: {
        curve: isLarge ? 'smooth' : 'straight',
        width: 2,
      },
      markers: {
        size: isLarge ? 4 : 0,
        colors: ['#fff'],
        strokeColors: this.chartColor(),
        strokeWidth: 2,
      },
      tooltip: { enabled: false },
    };
  });
}
