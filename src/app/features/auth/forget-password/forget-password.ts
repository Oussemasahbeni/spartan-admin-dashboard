import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { email, Field, form, required } from '@angular/forms/signals';
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
import { AuthLayout } from '../auth-layout';

@Component({
  selector: 'app-forget-password',
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
  templateUrl: './forget-password.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPassword {
  private readonly _router = inject(Router);
  public readonly isLoading = signal(false);
  readonly showAlert = signal(false);

  readonly forgetPasswordModel = signal({
    email: '',
  });

  readonly forgetPasswordForm = form(this.forgetPasswordModel, (schema) => {
    required(schema.email, { message: 'emailRequired' });
    email(schema.email, { message: 'emailInvalid' });
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.forgetPasswordForm().invalid()) {
      this.forgetPasswordForm.email().markAsTouched();
      return;
    }
    this.isLoading.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.forgetPasswordForm().reset({ email: '' });
      this.showAlert.set(true);
    }, 2000);
  }
}
