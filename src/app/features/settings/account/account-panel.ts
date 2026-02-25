import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideGlobe } from '@ng-icons/lucide';
import { CountryPicker } from '@shared/components/country-picker/country-picker';
import { PhoneNumberPicker } from '@shared/components/phone-number-picker/phone-number-picker';
import { ValidationErrors } from '@shared/components/validation-errors/validation-errors';
import { countries } from '@shared/countries';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
  selector: 'adm-settings-account',
  templateUrl: './account-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmFieldImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSelectImports,
    HlmSeparatorImports,
    HlmTextareaImports,
    BrnSelectImports,
    FormField,
    FormRoot,
    ValidationErrors,
    CountryPicker,
    PhoneNumberPicker,
    HlmSpinner,
    TranslocoModule,
  ],
  providers: [
    provideIcons({
      lucideGlobe,
    }),
  ],
})
export class SettingsAccount {
  // ==========================================
  // State
  // ==========================================

  readonly isLoading = signal(false);
  readonly languages = ['english', 'french', 'arabic'];

  readonly accountModel = signal({
    name: 'Oussema Sahbeni',
    username: '@spike',
    title: 'Software engineer',
    company: 'Oddo Bhf',
    about:
      'Hey! This is oussema; a software engineer based in Tunisia. I love building web applications and exploring new technologies. In my free time, I enjoy gaming and gym 💪.',
    email: 'oussemasahbeni300@gmail.com',
    phone: '+21654750526',
    country: countries.find((c) => c.iso === 'tn') || null,
    language: 'english',
  });

  readonly accountForm = form(
    this.accountModel,
    (schema) => {
      required(schema.name);
      required(schema.email);
      email(schema.email);
    },
    {
      submission: {
        action: async () => this.saveAccount(),
      },
    }
  );

  // ==========================================
  // Private Methods
  // ==========================================

  private saveAccount(): void {
    this.isLoading.set(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Account saved:', this.accountModel());
      this.isLoading.set(false);
    }, 1500);
  }
}
