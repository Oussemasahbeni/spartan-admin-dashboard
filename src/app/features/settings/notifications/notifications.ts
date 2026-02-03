import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, submit } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'adm-settings-notifications',
  templateUrl: './notifications.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, HlmCheckboxImports, HlmSeparatorImports, HlmSpinner, FormField, TranslocoModule],
})
export class SettingsNotifications {
  // ==========================================
  // State
  // ==========================================

  readonly isLoading = signal(false);

  readonly notificationsModel = signal({
    communication: true,
    security: true,
    meetups: false,
    comments: false,
    mention: true,
    follow: true,
    inquiry: true,
  });

  readonly notificationsForm = form(this.notificationsModel);

  // ==========================================
  // Public Methods
  // ==========================================

  onSubmit(event: Event): void {
    submit(this.notificationsForm, async () => {
      event.preventDefault();
      this.saveNotifications();
    });
  }

  // ==========================================
  // Private Methods
  // ==========================================

  private saveNotifications(): void {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Notifications saved:', this.notificationsModel());
      this.isLoading.set(false);
    }, 1500);
  }
}
