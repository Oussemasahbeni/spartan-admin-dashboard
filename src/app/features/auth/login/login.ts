import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff, lucideGithub } from '@ng-icons/lucide';
import { svglGoogle } from '@ng-icons/svgl';
import { ValidationErrors } from '@shared/components/validation-errors/validation-errors';
import { LOCAL_STORAGE } from '@shared/tokens';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
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
    HlmInputGroupImports,
    TranslocoModule,
    HlmCard,
    RouterLink,
    AuthLayout,
    FormField,
    FormRoot,
    ValidationErrors,
  ],
  providers: [
    provideIcons({
      lucideGithub,
      lucideEye,
      lucideEyeOff,
      svglGoogle,
    }),
  ],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  // ==========================================
  // Services
  // ==========================================

  private readonly _router = inject(Router);
  private readonly _localStorage = inject(LOCAL_STORAGE);

  // ==========================================
  // State
  // ==========================================

  readonly isLoading = signal(false);
  readonly showPassword = signal(false);

  readonly loginModel = signal({
    email: '',
    password: '',
  });

  readonly loginForm = form(
    this.loginModel,
    (schema) => {
      required(schema.email);
      email(schema.email);
      required(schema.password);
    },
    {
      submission: {
        action: async () => this.onLogin(),
      },
    }
  );

  // ==========================================
  // Private Methods
  // ==========================================

  onLogin(): void {
    this.isLoading.set(true);
    this._localStorage?.setItem('token', 'dummy-jwt-token');
    this._router.navigate(['/dashboard/dashboard-1']);
  }
}
