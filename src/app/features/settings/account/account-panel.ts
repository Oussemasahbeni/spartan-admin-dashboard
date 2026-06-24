import { Component, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGlobe } from '@ng-icons/lucide';
import { CountryPicker } from '@shared/components/country-picker/country-picker';
import { PhoneNumberPicker } from '@shared/components/phone-number-picker/phone-number-picker';
import { countries } from '@shared/countries';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';

import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';

@Component({
  selector: 'adm-settings-account',
  templateUrl: './account-panel.html',

  imports: [
    HlmButtonImports,
    NgIcon,
    HlmFieldImports,
    HlmInputImports,
    HlmLabelImports,
    HlmSelectImports,
    HlmSeparatorImports,
    HlmTextareaImports,
    FormField,
    FormRoot,
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

  protected readonly languages = ['english', 'french', 'arabic'];

  protected readonly accountModel = signal({
    name: 'Oussema Sahbeni',
    username: '@spike',
    title: 'Software engineer',
    company: 'Oddo BHF',
    about:
      'Hey! This is oussema; a software engineer based in Tunisia. I love building web applications and exploring new technologies. In my free time, I enjoy gaming and gym 💪.',
    email: 'oussemasahbeni300@gmail.com',
    phone: '+21654750526',
    country: countries.find((c) => c.iso === 'tn') || null,
    language: 'english',
  });

  protected readonly accountForm = form(
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

  private async saveAccount(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Account saved:', this.accountModel());
  }
}
