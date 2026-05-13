import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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

@Component({
  selector: 'adm-metric-card',
  imports: [HlmIconImports, HlmLabelImports, HlmCardImports, HlmTooltipImports, TranslocoModule],
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
    <section *transloco="let t; prefix: 'dashboard1.metricCard'" hlmCard class="h-full w-full py-4">
      <!-- Header -->
      <header hlmCardHeader class="flex flex-row items-center justify-between">
        <div class="flex items-center gap-2">
          <ng-icon hlm size="sm" [name]="icon()" />
          <h1 hlmCardTitle class="text-muted-foreground text-sm font-medium">{{ title() }}</h1>
        </div>

        <div hlmCardAction>
          <ng-icon hlm name="lucideInfo" size="sm" [hlmTooltip]="tooltip() ?? ''" />
        </div>
      </header>

      <!-- Content: The main metrics and the chart -->
      <main hlmCardContent class="flex items-end justify-between">
        <div>
          <div class="text-3xl font-bold tracking-tight tabular-nums">{{ value() }}</div>
          <p hlmCardDescription class="mt-1 text-xs font-medium">{{ description() }}</p>
        </div>

        <div class="h-12 w-24">
          <svg class="h-full w-full overflow-visible" viewBox="0 0 96 48" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              [attr.stroke]="chartColor()"
              [attr.points]="compactChartPoints()"
            />
          </svg>
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
          <ng-icon hlm class="fill-current" size="xs" [name]="trendUp() ? 'lucideTrendingUp' : 'lucideTrendingDown'" />
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

  private readonly orderedChartData = computed(() => {
    const data = this.chartData();
    return this.rtl() ? [...data].reverse() : data;
  });

  protected readonly compactChartPoints = computed(() => this.buildPolyline(this.orderedChartData(), 96, 48, 8));

  protected readonly largeChartPoints = computed(() => this.buildPolyline(this.orderedChartData(), 320, 80, 10));

  protected readonly largeChartMarkers = computed(() => this.buildMarkerPoints(this.orderedChartData(), 320, 80, 10));

  private buildPolyline(data: number[], width: number, height: number, padding: number) {
    const points = this.buildMarkerPoints(data, width, height, padding);
    return points.map(({ x, y }) => `${x},${y}`).join(' ');
  }

  private buildMarkerPoints(data: number[], width: number, height: number, padding: number) {
    if (data.length === 0) {
      return [];
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const span = max - min || 1;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    return data.map((value, index) => {
      const x = data.length === 1 ? width / 2 : padding + (usableWidth * index) / (data.length - 1);
      const y = height - padding - ((value - min) / span) * usableHeight;
      return {
        x: Number(x.toFixed(2)),
        y: Number(y.toFixed(2)),
      };
    });
  }
}
