import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DirectionalityService } from '@core/config/directionality.service';
import { provideTranslocoScope, translateObjectSignal, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsisVertical, lucideTrendingUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';

const SCOPE = { scope: 'dashboard/dashboard1', alias: 'dashboard1' };

interface MonthsTranslation {
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
}

@Component({
  selector: 'adm-customers-card',
  imports: [HlmCardImports, HlmButtonImports, HlmIconImports, NgApexchartsModule, TranslocoModule],
  providers: [provideTranslocoScope(SCOPE), provideIcons({ lucideEllipsisVertical, lucideTrendingUp })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section *transloco="let t; prefix: 'dashboard1.analytics.customersCard'" hlmCard class="h-full w-full">
      <div hlmCardHeader class="flex flex-row items-start justify-between gap-2">
        <div>
          <h3 hlmCardTitle class="text-lg font-semibold">{{ t('title') }}</h3>
          <p hlmCardDescription>{{ t('description') }}</p>
        </div>

        <button type="button" hlmBtn variant="ghost" size="icon">
          <ng-icon hlmIcon name="lucideEllipsisVertical" size="sm" />
        </button>
      </div>

      <div hlmCardContent>
        <apx-chart
          [grid]="chartOptions().grid!"
          [series]="chartOptions().series!"
          [chart]="chartOptions().chart!"
          [xaxis]="chartOptions().xaxis!"
          [yaxis]="chartOptions().yaxis!"
          [legend]="chartOptions().legend!"
          [fill]="chartOptions().fill!"
          [stroke]="chartOptions().stroke!"
          [dataLabels]="chartOptions().dataLabels!"
          [colors]="chartOptions().colors!"
        />
      </div>

      <div hlmCardFooter class="flex items-center gap-2 text-sm">
        <ng-icon hlmIcon name="lucideTrendingUp" size="sm" class="text-success" />
        <span class="text-success font-medium">{{ t('trendingText') }}</span>
      </div>
    </section>
  `,
})
export class CustomersCard {
  private readonly _dir = inject(DirectionalityService);
  private readonly rtl = this._dir.isRtl;

  private readonly _months = translateObjectSignal('months', {}, SCOPE);

  readonly months = computed(() => this._months() as MonthsTranslation);

  readonly chartOptions = computed<ApexOptions>(() => {
    const m = this.months();
    const isRtl = this.rtl();
    const categories = [m.jan, m.feb, m.mar, m.apr, m.may, m.jun];
    const data = [180, 220, 150, 300, 280, 350];

    return {
      grid: {
        show: false,
      },
      series: [
        {
          name: 'Customers',
          data: isRtl ? [...data].reverse() : data,
        },
      ],
      chart: {
        type: 'area',
        height: 200,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      yaxis: {
        show: false,
        opposite: isRtl,
      },
      xaxis: {
        categories: isRtl ? [...categories].reverse() : categories,
        reversed: isRtl,
        labels: {
          style: { colors: 'var(--muted-foreground)', fontSize: '12px' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      colors: ['var(--color-chart-orange)'],
    };
  });
}
