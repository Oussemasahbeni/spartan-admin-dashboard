import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DirectionalityService } from '@core/config/directionality-service';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideBell, lucideCreditCard, lucideLock, lucideMenu, lucideUserCircle, lucideUsers } from '@ng-icons/lucide';
import { BrnSheet, BrnSheetImports } from '@spartan-ng/brain/sheet';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { SettingsAccount } from '../account/account-panel';
import { SettingsNotifications } from '../notifications/notifications';
import { SettingsPlanBilling } from '../plan-billing/plan-billing';
import { SettingsSecurity } from '../security/security-panel';
import { SettingsTeam } from '../team/team.component';

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
    SettingsSecurity,
    SettingsPlanBilling,
    SettingsNotifications,
    SettingsTeam,
  ],
  templateUrl: './settings.html',
  providers: [provideIcons({ lucideUserCircle, lucideLock, lucideCreditCard, lucideBell, lucideUsers, lucideMenu })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Settings {
  // ==========================================
  // Services
  // ==========================================

  private readonly _router = inject(Router);
  private readonly _dir = inject(DirectionalityService);

  // ==========================================
  // ViewChild
  // ==========================================

  public readonly viewchildSheetRef = viewChild(BrnSheet);

  // ==========================================
  // Inputs (from route query params)
  // ==========================================

  public readonly panel = input<string>(); // Automatically bound from ?panel=xxx

  // ==========================================
  // State
  // ==========================================

  public readonly panels = signal<Panel[]>([
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

  protected readonly dir = this._dir.isRtl;

  protected readonly selectedPanel = linkedSignal<Panel>(() => {
    const panelId = this.panel();

    if (panelId) {
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
      queryParams: { panel: panel.id },
      queryParamsHandling: 'merge',
    });
  }
}
