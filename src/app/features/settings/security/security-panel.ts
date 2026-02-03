import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, minLength, submit } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideBell, lucideEye, lucideEyeOff, lucideKey, lucideLock, lucideShieldCheck } from '@ng-icons/lucide';
import { ValidationErrors } from '@shared/components/validation-errors/validation-errors';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'adm-settings-security',
  templateUrl: './security-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmFieldImports,
    HlmInputImports,
    HlmSeparatorImports,
    HlmCheckboxImports,
    HlmInputGroupImports,
    HlmCheckboxImports,
    HlmSpinner,
    FormField,
    ValidationErrors,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideKey, lucideLock, lucideShieldCheck, lucideEyeOff, lucideEye, lucideBell })],
})
export class SettingsSecurity {
  // ==========================================
  // State
  // ==========================================

  readonly isLoading = signal(false);
  readonly showCurrentPassword = signal(false);
  readonly showNewPassword = signal(false);

  readonly securityModel = signal({
    currentPassword: '',
    newPassword: '',
    twoStepAuth: true,
    passwordChangeReminder: false,
  });

  readonly securityForm = form(this.securityModel, (schema) => {
    minLength(schema.newPassword, 8);
  });

  // ==========================================
  // Public Methods
  // ==========================================

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.securityForm, async () => {
      this.saveSecurity();
    });
  }

  // ==========================================
  // Private Methods
  // ==========================================

  private saveSecurity(): void {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Security settings saved:', this.securityModel());
      this.isLoading.set(false);
    }, 1500);
  }
}
