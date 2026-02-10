import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucideChevronsUpDown, lucideGlobe, lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupAddon } from '@spartan-ng/helm/input-group';
import { countries, Country } from '../../countries';
import { CountryDisplay } from '../country-display/country-display';

@Component({
  selector: 'adm-phone-number-picker',
  imports: [
    HlmButtonImports,
    HlmInputImports,
    HlmComboboxImports,
    HlmIconImports,
    HlmInputGroupAddon,
    TranslocoModule,
    CountryDisplay,
  ],
  providers: [
    provideIcons({
      lucideCheck,
      lucideSearch,
      lucideChevronDown,
      lucideChevronsUpDown,
      lucideGlobe,
    }),
  ],
  templateUrl: './phone-number-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneNumberPicker implements FormValueControl<string> {
  // ==========================================
  // Services
  // ==========================================
  private readonly _translocoService = inject(TranslocoService);

  // ==========================================
  // Inputs
  // ==========================================
  readonly value = model<string>('');
  readonly touched = model<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly disabled = input<boolean>(false);

  // ==========================================
  // State
  // ==========================================
  protected readonly selectedCountry = linkedSignal<string, Country | null>({
    source: this.value,
    computation: (fullValue) => {
      if (!fullValue) return null;
      // Find the longest matching code first (e.g., +1 242 before +1)
      const sorted = [...this._countriesList()].sort((a, b) => b.code.length - a.code.length);
      return sorted.find((c) => fullValue.startsWith(c.code)) || null;
    },
  });

  protected readonly rawPhoneNumber = linkedSignal<string, string>({
    source: this.value,
    computation: (fullValue) => {
      const country = this.selectedCountry();
      if (!fullValue) return '';
      if (!country) return fullValue;
      // Strip the code to get just the numbers for the input field
      return fullValue.replace(country.code, '');
    },
  });
  protected readonly _countriesList = signal(countries);

  protected readonly activeLang = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  // ==========================================
  // Public Methods
  // ==========================================
  countrySelected(country: Country) {
    this.selectedCountry.set(country);
    this.updateValue();
    this.touched.set(true);
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.rawPhoneNumber.set(input.value);
    this.updateValue();
  }

  private updateValue() {
    const code = this.selectedCountry()?.code ?? '';
    const phone = this.rawPhoneNumber();

    this.value.set(`${code}${phone}`);
  }
}
