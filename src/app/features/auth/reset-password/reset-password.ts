import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';
import { ValidationErrors } from '@shared/components/validation-errors/validation-errors';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthLayout } from '../layout';

@Component({
  selector: 'adm-forget-password',
  imports: [
    HlmButtonImports,
    HlmIconImports,
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
    ValidationErrors,
  ],
  providers: [provideIcons({ lucideCircleCheck })],
  templateUrl: './reset-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ResetPassword {
  // ==========================================
  // Services
  // ==========================================

  private readonly _router = inject(Router);

  // ==========================================
  // State
  // ==========================================

  protected readonly isLoading = signal(false);
  protected readonly showAlert = signal(false);

  protected readonly resetPasswordModel = signal({
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

  onSubmit(): void {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.resetPasswordForm().reset({ email: '' });
      this.showAlert.set(true);
    }, 2000);
  }
}
