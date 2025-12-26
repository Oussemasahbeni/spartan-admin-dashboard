import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  email,
  Field,
  form,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff, lucideGithub } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { AuthLayout } from '../auth-layout';

@Component({
  selector: 'app-signup',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmFieldImports,
    HlmInputImports,
    HlmCheckboxImports,
    HlmLabelImports,
    HlmSpinnerImports,
    Field,
    TranslocoModule,
    HlmCard,
    RouterLink,
    AuthLayout,
  ],
  providers: [
    provideIcons({
      lucideGithub,
      lucideEye,
      lucideEyeOff,
    }),
  ],
  templateUrl: './signup.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  private readonly _router = inject(Router);
  public readonly isLoading = signal(false);
  public readonly showPassword = signal(false);
  public readonly showConfirmPassword = signal(false);

  readonly signupModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  readonly signupForm = form(this.signupModel, (schema) => {
    required(schema.name, { message: 'nameRequired' });
    required(schema.email, { message: 'emailRequired' });
    email(schema.email, { message: 'emailInvalid' });
    required(schema.password, { message: 'passwordRequired' });
    minLength(schema.password, 6, { message: 'passwordMinLength' });
    required(schema.confirmPassword, { message: 'confirmPasswordRequired' });
    validate(schema.confirmPassword, ({ value, valueOf }) => {
      const confirmPassword = value();
      const password = valueOf(schema.password);
      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'passwordMismatch',
        };
      }
      return null;
    });
  });

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSignup(event: Event): void {
    event.preventDefault();
    if (this.signupForm().invalid()) {
      this.signupForm.name().markAsTouched();
      this.signupForm.email().markAsTouched();
      this.signupForm.password().markAsTouched();
      this.signupForm.confirmPassword().markAsTouched();
      return;
    }

    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this._router.navigate(['/login']);
    }, 2000);
  }
}
