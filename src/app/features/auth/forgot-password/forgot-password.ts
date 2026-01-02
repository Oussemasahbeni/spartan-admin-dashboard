import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, Field, form, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck } from '@ng-icons/lucide';
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
    Field,
    TranslocoModule,
    HlmCard,
    RouterLink,
    AuthLayout,
  ],
  providers: [provideIcons({ lucideCircleCheck })],
  templateUrl: './forgot-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
  private readonly _router = inject(Router);
  public readonly isLoading = signal(false);
  readonly showAlert = signal(false);

  readonly forgotPasswordModel = signal({
    email: '',
  });

  readonly forgotPasswordForm = form(this.forgotPasswordModel, (schema) => {
    required(schema.email);
    email(schema.email);
  });

  onSubmit(): void {
    submit(this.forgotPasswordForm, async () => {
      this.isLoading.set(true);

      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        this.forgotPasswordForm().reset({ email: '' });
        this.showAlert.set(true);
      }, 2000);
    });
  }
}
