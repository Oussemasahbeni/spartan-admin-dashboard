import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, Field, form, minLength, required, submit, validate } from '@angular/forms/signals';
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
import { AuthLayout } from '../layout';

@Component({
  selector: 'adm-signup',
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
  readonly passwordMinLength = 8;

  readonly signupModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  readonly signupForm = form(this.signupModel, (schema) => {
    required(schema.name);
    required(schema.email);
    email(schema.email);
    required(schema.password);
    minLength(schema.password, this.passwordMinLength);
    required(schema.confirmPassword);
    validate(schema.confirmPassword, ({ value, valueOf }) => {
      const confirmPassword = value();
      const password = valueOf(schema.password);
      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
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

  onSubmit() {
    submit(this.signupForm, async () => {
      this.onSignup();
    });
  }

  onSignup(): void {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this._router.navigate(['/login']);
    }, 2000);
  }
}
