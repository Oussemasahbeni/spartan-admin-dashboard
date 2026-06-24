import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthLayout } from '../layout';

@Component({
  selector: 'adm-forget-password',
  imports: [
    HlmButtonImports,
    NgIcon,
    HlmFieldImports,
    HlmInputImports,
    HlmSpinnerImports,
    HlmAlertImports,
    FormField,
    FormRoot,
    TranslocoModule,
    HlmCard,
    RouterLink,
    AuthLayout,
  ],
  providers: [provideIcons({ lucideCircleCheck })],
  templateUrl: './reset-password.html',
})
export default class ResetPassword {
  // ==========================================
  // State
  // ==========================================

  protected readonly showAlert = signal(false);

  private readonly resetPasswordModel = signal({
    email: '',
  });

  protected readonly resetPasswordForm = form(
    this.resetPasswordModel,
    (schema) => {
      required(schema.email);
      email(schema.email);
    },
    {
      submission: {
        action: async () => this.onSubmit(),
      },
    }
  );

  // ==========================================
  // Public Methods
  // ==========================================

  async onSubmit(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    this.resetPasswordForm().reset({ email: '' });
    this.showAlert.set(true);
  }
}
