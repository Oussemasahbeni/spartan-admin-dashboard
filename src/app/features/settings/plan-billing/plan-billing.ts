import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCheck,
  lucideCreditCard,
  lucideHash,
  lucideInfo,
  lucideLock,
  lucideMapPin,
  lucideUser,
} from '@ng-icons/lucide';
import { CountryPicker } from '@shared/components/country-picker/country-picker';
import { countries } from '@shared/countries';

import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmRadioGroupImports } from '@spartan-ng/helm/radio-group';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { hlm } from '@spartan-ng/helm/utils';

interface Plan {
  value: string;
  label: string;
  details: string;
  price: string;
}

@Component({
  selector: 'adm-settings-plan-billing',
  templateUrl: './plan-billing.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmFieldImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmSelectImports,
    HlmAlertImports,
    HlmSeparatorImports,
    HlmCardImports,
    HlmRadioGroupImports,
    HlmSpinner,
    FormField,
    FormRoot,
    TranslocoModule,
    CurrencyPipe,
    CountryPicker,
  ],
  providers: [
    provideIcons({
      lucideUser,
      lucideCreditCard,
      lucideCalendar,
      lucideLock,
      lucideMapPin,
      lucideHash,
      lucideCheck,
      lucideInfo,
    }),
  ],
})
export class SettingsPlanBilling {
  // ==========================================
  // State
  // ==========================================

  protected readonly plans = signal<Plan[]>([
    {
      value: 'basic',
      label: 'BASIC',
      details: 'Starter plan for individuals.',
      price: '10',
    },
    {
      value: 'team',
      label: 'TEAM',
      details: 'Collaborate up to 10 people.',
      price: '20',
    },
    {
      value: 'enterprise',
      label: 'ENTERPRISE',
      details: 'For bigger businesses.',
      price: '40',
    },
  ]);

  public readonly cardClass = hlm(
    'relative block space-x-0 flex items-center',
    // base card styles
    'border-border flex flex-col items-center justify-center rounded-lg border-2 px-4 py-8',
    // hover and background styles
    'bg-background hover:bg-accent/10 cursor-pointer transition-colors',
    // spacing for the icon and text
    '[&>span]:mt-4',
    // target the checked state properly
    '[&:has([data-checked=true])]:border-primary [&:has([data-checked=true])]:border-2'
  );

  protected readonly planBillingModel = signal({
    plan: 'team',
    cardHolder: 'Oussema Sahbeni',
    cardNumber: '',
    cardExpiration: '',
    cardCVC: '',
    country: countries.find((c) => c.iso === 'tn') || null,
    zip: '',
  });

  protected readonly planBillingForm = form(
    this.planBillingModel,
    (schema) => {
      required(schema.cardHolder);
      required(schema.cardNumber);
      required(schema.cardExpiration);
      required(schema.cardCVC);
    },
    {
      submission: {
        action: async () => this.savePlanBilling(),
      },
    }
  );

  // ==========================================
  // Public Methods
  // ==========================================

  selectPlan(planValue: string): void {
    this.planBillingModel.update((m) => ({ ...m, plan: planValue }));
  }

  // ==========================================
  // Private Methods
  // ==========================================

  private async savePlanBilling(): Promise<void> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Plan & Billing saved:', this.planBillingModel());
  }
}
