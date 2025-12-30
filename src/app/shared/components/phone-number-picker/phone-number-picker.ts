import { ChangeDetectionStrategy, Component, inject, input, linkedSignal, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucideChevronsUpDown, lucideGlobe, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { countries, Country } from '../../countries';
import { CountryDisplay } from '../country-display/country-display';

@Component({
  selector: 'app-phone-number-picker',
  imports: [
    HlmButtonImports,
    HlmInputImports,
    BrnCommandImports,
    HlmCommandImports,
    BrnPopoverImports,
    HlmPopoverImports,
    HlmIconImports,
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
  private readonly _translocoService = inject(TranslocoService);

  readonly value = model<string>('');
  readonly touched = model<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly disabled = input<boolean>(false);

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
  protected readonly state = signal<'closed' | 'open'>('closed');

  protected readonly activeLang = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  countrySelected(country: Country) {
    this.state.set('closed');
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
