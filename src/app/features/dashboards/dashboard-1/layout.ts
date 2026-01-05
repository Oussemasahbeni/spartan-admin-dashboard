import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideActivity, lucideBarChart2, lucideDownload, lucideFileText, lucideFilter, lucideHome } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { AnalyticsDashboard } from './analytics/analytics';
import { OverviewDashboard } from './overview/overview';

@Component({
  selector: 'adm-dashboard1-layout',
  imports: [
    HlmIconImports,
    HlmButtonImports,
    HlmTabsImports,
    HlmSpinnerImports,
    OverviewDashboard,
    AnalyticsDashboard,
    TranslocoModule,
  ],
  templateUrl: './layout.html',
  providers: [
    provideIcons({
      lucideFilter,
      lucideDownload,
      lucideHome,
      lucideBarChart2,
      lucideFileText,
      lucideActivity,
    }),
    provideTranslocoScope({ scope: 'dashboard/dashboard1', alias: 'dashboard1' }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard1Layout {
  private readonly _dir = inject(Directionality);

  // TODO: to be removed once spartan fixes the dir issue
  readonly dir = this._dir.valueSignal;

  protected readonly selectedTab = signal('overview');

  onTabChange(tab: string) {
    this.selectedTab.set(tab);
  }
}
