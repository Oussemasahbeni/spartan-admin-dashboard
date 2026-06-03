import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'adm-settings-notifications',
  templateUrl: './notifications.html',
  imports: [HlmButtonImports, HlmCheckboxImports, HlmSeparatorImports, HlmSpinner, FormField, FormRoot, TranslocoModule],
})
export class SettingsNotifications {
  // ==========================================
  // State
  // ==========================================

  protected readonly notificationsModel = signal({
    communication: true,
    security: true,
    meetups: false,
    comments: false,
    mention: true,
    follow: true,
    inquiry: true,
  });

  protected readonly notificationsForm = form(this.notificationsModel, {
    submission: {
      action: async () => this.saveNotifications(),
    },
  });

  // ==========================================
  // Private Methods
  // ==========================================

  private async saveNotifications(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Notifications saved:', this.notificationsModel());
  }
}
