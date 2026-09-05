import { Component, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HLM_CHART_THEME, HlmChartImports } from '@spartan-ng/helm/chart';
import { defineChart } from '@tanstack/charts';
import { pie, polar, radialArc } from '@tanstack/charts/polar';

interface GaugeSlice {
  status: 'complete' | 'remaining';
  value: number;
}

@Component({
  selector: 'adm-buyers-profile-card',
  imports: [HlmCardImports, HlmChartImports, NgIcon, TranslocoModule],
  providers: [provideIcons({ lucideTrendingUp })],
  template: `
    <section
      *transloco="let t; prefix: 'dashboard1.analytics.buyersProfileCard'"
      hlmCard
      class="flex h-full w-full flex-col"
    >
      <header hlmCardHeader>
        <h1 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h1>
        <p hlmCardDescription>{{ t('description') }}</p>
      </header>

      <main hlmCardContent class="flex flex-1 items-center justify-center">
        <div class="relative w-50">
          <tanstack-chart hlmChart [options]="_chartOptions()" />
          <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl font-bold">{{ buyers }}</span>
            <span class="text-muted-foreground text-sm">{{ t('buyers') }}</span>
          </div>
        </div>
      </main>

      <footer hlmCardFooter class="flex items-center gap-2 text-sm">
        <ng-icon name="lucideTrendingUp" class="text-success" />
        <span class="text-success font-medium">{{ t('trendingText') }}</span>
      </footer>
    </section>
  `,
})
export class BuyersProfileCard {
  protected readonly buyers = 200;
  private readonly percent = 75;

  protected readonly _chartOptions = computed(() => {
    const slices: GaugeSlice[] = [
      { status: 'complete', value: this.percent },
      { status: 'remaining', value: 100 - this.percent },
    ];

    const arcs = pie(slices, {
      value: 'value',
      startAngle: -Math.PI * 0.75,
      endAngle: Math.PI * 0.75,
    });

    return {
      definition: defineChart(
        {
          marks: [
            polar({
              radiusRatio: 0.95,
              scales: { angle: null, radius: null },
              marks: [
                radialArc(arcs, {
                  innerRadius: ({ radius }) => radius * 0.7,
                  cornerRadius: 999,
                  color: 'status',
                  key: 'status',
                }),
              ],
            }),
          ],
          scales: { x: null, y: null },
          color: {
            domain: ['complete', 'remaining'],
            range: ['var(--chart-1)', 'var(--muted)'],
          },
          margin: 0,
          theme: HLM_CHART_THEME,
        },
        { focus: false }
      ),
      ariaLabel: 'Buyers profile',
      height: 200,
    };
  });
}
