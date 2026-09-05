import { Component, computed, inject, signal } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality-service';
import { translateObjectSignal, TranslocoModule } from '@jsverse/transloco';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { barX, ChartPoint, ChartTooltipContent, defineChart } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';

interface TrafficSourceCardTranslation {
  google: string;
  social: string;
  direct: string;
}

interface Row {
  source: string;
  value: number;
}

const formatK = (v: number) => `${v / 1000}k`;

@Component({
  selector: 'adm-traffic-source-card',
  imports: [HlmCardImports, HlmChartImports, HlmTabsImports, TranslocoModule],
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.trafficSourceCard'" hlmCard class="h-full w-full">
      <hlm-tabs class="w-auto" [tab]="selectedPeriod()" (tabActivated)="selectedPeriod.set($event)">
        <header hlmCardHeader class="flex flex-row items-start justify-between gap-2">
          <div>
            <h1 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h1>
            <p hlmCardDescription>{{ t('description') }}</p>
          </div>

          <hlm-tabs-list *transloco="let t; prefix: 'dashboard1'">
            <button type="button" hlmTabsTrigger="month" [aria-label]="t('period.month')">{{ t('period.month') }}</button>
            <button type="button" hlmTabsTrigger="week" [aria-label]="t('period.week')">{{ t('period.week') }}</button>
          </hlm-tabs-list>
        </header>

        <main hlmCardContent class="mt-4" [hlmTabsContent]="selectedPeriod()">
          <tanstack-chart hlmChart [options]="_chartOptions()" />
        </main>
      </hlm-tabs>
    </section>
  `,
})
export class TrafficSourceCard {
  private readonly _dir = inject(DirectionalityService);

  protected readonly selectedPeriod = signal<string>('month');

  private readonly _trafficCard = translateObjectSignal('analytics.trafficSourceCard.sources');
  protected readonly trafficCard = computed(() => this._trafficCard() as TrafficSourceCardTranslation);

  protected readonly _chartOptions = computed(() => {
    const t = this.trafficCard();
    const isRtl = this._dir.isRtl();
    const sources = [t.google, t.social, t.direct];
    const values = this.selectedPeriod() === 'month' ? [186, 305, 237] : [62, 102, 79];

    const rows: Row[] = sources.map((source, i) => ({ source, value: values[i] }));

    return {
      definition: defineChart(
        {
          marks: [
            barX(rows, {
              id: 'traffic-bars',
              x: 'value',
              y: 'source',
              key: 'source',
              color: 'source',
              radius: 4,
            }),
          ],
          scales: {
            x: {
              scale: () => scaleLinear().domain([0, 350]),
              reverse: isRtl,
              grid: false,
              axis: { line: false, ticks: { size: 0, format: formatK } },
            },
            y: {
              scale: () => scaleBand<string>().padding(0.5),
              axis: { line: false, ticks: { size: 0, padding: 8 } },
            },
          },
          color: {
            domain: sources,
            range: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'],
          },
          theme: HLM_CHART_THEME,
        },
        {
          focus: 'group-y',
          tooltip: hlmChartTooltip({
            content: (points: readonly ChartPoint<Row, number, string>[]) => this.tooltipContent(points),
          }),
        }
      ),
      ariaLabel: 'Traffic by source',
      height: 180,
    };
  });

  private tooltipContent(points: readonly ChartPoint<Row, number, string>[]): ChartTooltipContent {
    const p = points[0];
    if (!p) return { rows: [] };
    return {
      rows: [{ label: p.yValue, value: p.xValue.toLocaleString(), color: p.color }],
    };
  }
}
