import { Component, computed } from '@angular/core';
import { provideTranslocoScope, translateObjectSignal, Translation } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports, hlmChartTooltip } from '@spartan-ng/helm/chart';
import { ChartPoint } from '@tanstack/angular-charts';
import { ChartTooltipContent, defineChart } from '@tanstack/charts';
import { focusGroupAngle, pie, PieDatum, polar, radialArc, radialText } from '@tanstack/charts/polar';
import { scaleLinear } from '@tanstack/charts/scales/linear';

const SCOPE = { scope: 'dashboard/dashboard2', alias: 'dashboard2' };

interface VisitorChartTranslation {
  title: string;
  period: string;
  trendingText: string;
  description: string;
  series: {
    desktop: string;
    mobile: string;
    tablet: string;
    other: string;
  };
}
interface Slice {
  key: string;
  label: string;
  value: number;
}

interface CenterLabel {
  id: string;
  angle: number;
  radius: number;
  text: string;
}

type DonutDatum = PieDatum<Slice> | CenterLabel;

@Component({
  selector: 'adm-visitor-chart-card',
  imports: [HlmCardImports, HlmChartImports, NgIcon],
  providers: [
    provideTranslocoScope(SCOPE),
    provideIcons({
      lucideTrendingUp,
    }),
  ],
  template: `
    <section hlmCard class="h-full w-full">
      <div hlmCardHeader class="text-center">
        <h3 hlmCardTitle class="text-base font-semibold">{{ visitorChart().title }}</h3>
        <p hlmCardDescription class="text-muted-foreground text-xs">{{ visitorChart().period }}</p>
      </div>

      <div hlmCardContent class="flex min-h-75 flex-1 items-center justify-center">
        <tanstack-chart [options]="_chartOptions()" />
      </div>

      <div hlmCardFooter class="flex flex-col items-center text-center">
        <div class="text-success flex items-center justify-center gap-2 text-sm font-medium">
          {{ visitorChart().trendingText }}
          <ng-icon name="lucideTrendingUp" />
        </div>
        <p class="text-muted-foreground mt-1 text-sm">{{ visitorChart().description }}</p>
      </div>
    </section>
  `,
})
export class VisitorChartCard {
  // ==========================================
  // State
  // ==========================================

  private readonly _visitorChart = translateObjectSignal('visitorChart', {}, SCOPE);

  protected readonly visitorChart = computed(() => this._visitorChart() as Translation & VisitorChartTranslation);

  protected readonly _chartOptions = computed(() => {
    const s = this.visitorChart().series;

    const slices: Slice[] = [
      { key: 'desktop', label: s.desktop, value: 1200 },
      { key: 'mobile', label: s.mobile, value: 600 },
      { key: 'tablet', label: s.tablet, value: 550 },
      { key: 'other', label: s.other, value: 500 },
    ];
    const total = slices.reduce((sum, r) => sum + r.value, 0);

    const marks = [
      radialArc(
        pie(slices, {
          value: 'value',
        }),
        {
          id: 'visitor-slices',
          key: 'key',
          innerRadius: ({ radius }) => radius * 0.75,
          color: 'key',
        }
      ),
      radialText([{ id: 'total', angle: 0, radius: 0, text: total.toLocaleString() }], {
        id: 'visitor-total',
        angle: 'angle',
        radius: 'radius',
        key: 'id',
        text: 'text',
        dy: -6,
        fill: 'var(--foreground)',
        fontSize: 36,
        fontWeight: 700,
      }),
    ];

    return {
      definition: defineChart(
        {
          marks: [
            polar({
              radiusRatio: 0.78,
              scales: {
                angle: { scale: scaleLinear().domain([0, Math.PI * 2]) },
                radius: { scale: scaleLinear().domain([0, 1]) },
              },
              marks,
            }),
          ],
          scales: { x: null, y: null },
          color: {
            domain: slices.map((s) => s.key),
            range: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'],
          },
          margin: 0,
          theme: HLM_CHART_THEME,
        },
        {
          focus: focusGroupAngle,
          tooltip: hlmChartTooltip({
            anchor: 'group-center',
            placement: 'auto',
            content: (points: readonly ChartPoint<DonutDatum, number, number>[]) => this.tooltipContent(points),
          }),
        }
      ),
      ariaLabel: this.visitorChart().title,
      height: 350,
    };
  });

  private tooltipContent(points: readonly ChartPoint<DonutDatum, number, number>[]): ChartTooltipContent {
    const p = points.find((c) => 'label' in c.datum);
    if (!p || !('label' in p.datum)) return { rows: [] };
    return {
      rows: [{ label: p.datum.label, value: p.datum.value.toLocaleString(), color: p.color }],
    };
  }
}
