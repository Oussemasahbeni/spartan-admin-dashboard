import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

const SCOPE = { scope: 'dashboard/dashboard1', alias: 'dashboard1' };

@Component({
  selector: 'adm-buyers-profile-card',
  imports: [HlmCardImports, HlmIconImports, NgApexchartsModule, TranslocoModule],
  providers: [provideTranslocoScope(SCOPE), provideIcons({ lucideTrendingUp })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      *transloco="let t; prefix: 'dashboard1.analytics.buyersProfileCard'"
      hlmCard
      class="flex h-full w-full flex-col"
    >
      <div hlmCardHeader>
        <h3 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h3>
        <p hlmCardDescription>{{ t('description') }}</p>
      </div>

      <div hlmCardContent class="flex flex-1 items-center justify-center">
        <div class="relative">
          <apx-chart
            [series]="chartOptions().series!"
            [chart]="chartOptions().chart!"
            [plotOptions]="chartOptions().plotOptions!"
            [stroke]="chartOptions().stroke!"
            [colors]="chartOptions().colors!"
            [labels]="chartOptions().labels!"
          />
          <!-- Center Label -->
          <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-4xl font-bold">200</span>
            <span class="text-muted-foreground text-sm">{{ t('buyers') }}</span>
          </div>
        </div>
      </div>

      <div hlmCardFooter class="flex items-center gap-2 text-sm">
        <ng-icon hlmIcon name="lucideTrendingUp" size="sm" class="text-success" />
        <span class="text-success font-medium">{{ t('trendingText') }}</span>
      </div>
    </section>
  `,
})
export class BuyersProfileCard {
  // ==========================================
  // State
  // ==========================================

  readonly chartOptions = signal<ApexOptions>({
    series: [75], // 75% completion
    chart: {
      type: 'radialBar',
      height: 200,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: '70%',
        },
        track: {
          background: 'var(--muted)',
          strokeWidth: '100%',
          margin: 0,
        },
        dataLabels: {
          show: false,
        },
      },
    },
    stroke: {
      lineCap: 'round',
    },
    colors: ['var(--color-chart-teal)'],
    labels: ['Buyers'],
  });
}
