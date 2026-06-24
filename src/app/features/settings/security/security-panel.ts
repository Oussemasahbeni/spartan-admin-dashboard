import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideEye, lucideEyeOff, lucideKey, lucideLock, lucideShieldCheck } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';

import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'adm-settings-security',
  templateUrl: './security-panel.html',

  imports: [
    HlmButtonImports,
    NgIcon,
    HlmFieldImports,
    HlmInputImports,
    HlmSeparatorImports,
    HlmCheckboxImports,
    HlmInputGroupImports,
    HlmCheckboxImports,
    HlmSpinner,
    FormField,
    FormRoot,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideKey, lucideLock, lucideShieldCheck, lucideEyeOff, lucideEye, lucideBell })],
})
export class SettingsSecurity {
  // ==========================================
  // State
  // ==========================================

  protected readonly showCurrentPassword = signal(false);
  protected readonly showNewPassword = signal(false);

  protected readonly securityModel = signal({
    currentPassword: '',
    newPassword: '',
    twoStepAuth: true,
    passwordChangeReminder: false,
  });

  protected readonly securityForm = form(
    this.securityModel,
    (schema) => {
      minLength(schema.newPassword, 8);
    },
    {
      submission: {
        action: async () => this.saveSecurity(),
      },
    }
  );

  // ==========================================
  // Private Methods
  // ==========================================

  private async saveSecurity(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Security settings saved:', this.securityModel());
  }
}
