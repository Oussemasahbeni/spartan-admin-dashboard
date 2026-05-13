import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  signal,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *transloco="let t; prefix: 'phoneNumberPicker'" class="flex">
      <hlm-combobox [value]="selectedCountry()" (valueChange)="selectedCountry.set($event)">
        <hlm-combobox-trigger class="flex gap-1 rounded-e-none border-e-0 focus-visible:ring-0">
          @if (selectedCountry()) {
            <adm-country-display [country]="selectedCountry()" [showCountryCode]="true" />
          } @else {
            <ng-icon hlm name="lucideGlobe" size="sm" />
          }
        </hlm-combobox-trigger>

        <hlm-combobox-content *hlmComboboxPortal class="w-64">
          <hlm-combobox-input showTrigger="false" mode="popup" [placeholder]="t('searchCountryPlaceholder')">
            <hlm-input-group-addon>
              <ng-icon name="lucideSearch" />
            </hlm-input-group-addon>
          </hlm-combobox-input>
          <hlm-combobox-empty *transloco="let t">{{ t('common.noData') }}</hlm-combobox-empty>
          <div hlmComboboxList>
            @for (country of _countriesList(); track country.id) {
              <hlm-combobox-item [value]="country">
                <adm-country-display [country]="country" />
                <span class="text-muted-foreground text-xs">{{ country.code }}</span>
              </hlm-combobox-item>
            }
          </div>
        </hlm-combobox-content>
      </hlm-combobox>

      <!-- Phone Number Input -->
      <input
        hlmInput
        class="flex-1 rounded-s-none"
        [placeholder]="t('enterPhoneNumberPlaceholder')"
        [value]="rawPhoneNumber()"
        (input)="onPhoneInput($event)"
        (blur)="touched.set(true)"
      />
    </div>
  `,
})
export class PhoneNumberPicker implements FormValueControl<string> {
  // ==========================================
  // Services
  // ==========================================
  private readonly _translocoService = inject(TranslocoService);

  // ==========================================
  // Inputs
  // ==========================================
  public readonly value = model<string>('');
  public readonly touched = model<boolean>(false);
  public readonly invalid = input(false, { transform: booleanAttribute });
  public readonly disabled = input(false, { transform: booleanAttribute });

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

  protected readonly activeLang = computed(() => this._translocoService.activeLang());

  // ==========================================
  // Public Methods
  // ==========================================
  protected countrySelected(country: Country) {
    this.selectedCountry.set(country);
    this.updateValue();
    this.touched.set(true);
  }

  protected onPhoneInput(event: Event) {
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
