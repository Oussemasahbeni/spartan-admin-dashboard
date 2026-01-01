import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, Field, form, minLength, required, submit } from '@angular/forms/signals';
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
  selector: 'adm-login',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmFieldImports,
    HlmInputImports,
    HlmCheckboxImports,
    HlmLabelImports,
    HlmSpinnerImports,
    HlmCheckboxImports,
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
    required(schema.email);
    email(schema.email);
    required(schema.password);
    minLength(schema.password, 6);
  });

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    submit(this.loginForm, async () => {
      this.onLogin();
    });
  }

  onLogin(): void {
    this.isLoading.set(true);
    localStorage.setItem('token', 'dummy-jwt-token');
    this._router.navigate(['/users']);
  }
}
