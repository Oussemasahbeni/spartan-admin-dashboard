import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Dashboard1Layout {
  // ==========================================
  // State
  // ==========================================

  protected readonly selectedTab = signal<'overview' | 'analytics'>('overview');

  // ==========================================
  // Public Methods
  // ==========================================

  onTabChange(tab: string) {
    this.selectedTab.set(tab as 'overview' | 'analytics');
  }
}
