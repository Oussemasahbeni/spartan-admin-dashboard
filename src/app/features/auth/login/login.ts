import { NgOptimizedImage } from '@angular/common';
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
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideEye,
  lucideEyeOff,
  lucideGithub,
  lucideLoaderCircle,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-login',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmFieldImports,
    HlmInputImports,
    HlmCheckboxImports,
    HlmLabelImports,
    HlmSpinnerImports,
    HlmCheckboxImports,
    NgOptimizedImage,
    Field,
    TranslocoModule,
    HlmCard,
  ],
  providers: [
    provideIcons({
      lucideGithub,
      lucideLoaderCircle,
      lucideEye,
      lucideEyeOff,
    }),
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly _router = inject(Router);
  public readonly isLoading = signal(false);
  public readonly showPassword = signal(false);

  readonly loginModel = signal({
    email: '',
    password: '',
  });

  readonly loginForm = form(this.loginModel, (schema) => {
    required(schema.email, { message: 'emailRequired' });
    email(schema.email, { message: 'emailInvalid' });
    required(schema.password, { message: 'passwordRequired' });
    minLength(schema.password, 6, { message: 'passwordMinLength' });
  });

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onLogin(event: Event): void {
    event.preventDefault();
    if (this.loginForm().invalid()) {
      this.loginForm.email().markAsTouched();
      this.loginForm.password().markAsTouched();
      return;
    }
    this.isLoading.set(true);
    localStorage.setItem('token', 'dummy-jwt-token');
    this._router.navigate(['/users']);
  }
}
