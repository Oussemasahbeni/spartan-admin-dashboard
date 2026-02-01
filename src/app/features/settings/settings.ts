import {
  ChangeDetectionStrategy,
  Component,
  inject,
  linkedSignal,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectionalityService } from '@core/config/directionality.service';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCreditCard, lucideLock, lucideMenu, lucideUserCircle, lucideUsers } from '@ng-icons/lucide';
import { BrnSheet, BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { SettingsAccount } from './account/account-panel';

interface Panel {
  id: string;
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'adm-settings',
  imports: [
    HlmIconImports,
    HlmButtonImports,
    HlmSeparatorImports,
    HlmSheetImports,
    BrnSheetImports,
    SettingsAccount,
    TranslocoModule,
  ],
  templateUrl: './settings.html',
  providers: [provideIcons({ lucideUserCircle, lucideLock, lucideCreditCard, lucideBell, lucideUsers, lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Settings {
  // ==========================================
  // Services
  // ==========================================

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _dir = inject(DirectionalityService);

  // ==========================================
  // ViewChild
  // ==========================================

  public readonly viewchildSheetRef = viewChild(BrnSheet);

  // ==========================================
  // State
  // ==========================================

  readonly panels = signal<Panel[]>([
    {
      id: 'account',
      icon: 'lucideUserCircle',
      title: 'Account',
      description: 'Manage your public profile and private information',
    },
    {
      id: 'security',
      icon: 'lucideLock',
      title: 'Security',
      description: 'Manage your password and 2-step verification preferences',
    },
    {
      id: 'planBilling',
      icon: 'lucideCreditCard',
      title: 'Plan & Billing',
      description: 'Manage your subscription plan, payment method and billing information',
    },
    {
      id: 'notifications',
      icon: 'lucideBell',
      title: 'Notifications',
      description: "Manage when you'll be notified on which channels",
    },
    {
      id: 'team',
      icon: 'lucideUsers',
      title: 'Team',
      description: 'Manage your existing team and change roles/permissions',
    },
  ]);

  readonly dir = this._dir.isRtl;

  readonly selectedPanel = linkedSignal<Panel>(() => {
    const panelId = this._route.snapshot.queryParamMap.get('panel');

    if (this._route.snapshot.queryParamMap.get('panel')) {
      const panel = this.panels().find((p) => p.id === panelId);
      if (panel) {
        return panel;
      }
    }
    return this.panels()[0];
  });

  // ==========================================
  // Public Methods
  // ==========================================

  goToPanel(panel: Panel): void {
    this.selectedPanel.set(panel);
    this.viewchildSheetRef()?.close({});
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: { panel: panel.id },
      queryParamsHandling: 'merge',
    });
  }
}
