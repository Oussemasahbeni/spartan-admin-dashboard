import { Component, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupAddon } from '@spartan-ng/helm/input-group';
import { countries, Country } from '../../countries';
import { CountryDisplay } from '../country-display/country-display';

@Component({
  selector: 'adm-country-picker',
  imports: [
    HlmButtonImports,
    HlmInputImports,
    HlmIconImports,
    HlmComboboxImports,
    HlmInputGroupAddon,
    TranslocoModule,
    CountryDisplay,
  ],
  providers: [
    provideIcons({
      lucideSearch,
    }),
  ],
  template: `
    <hlm-combobox *transloco="let t; prefix: 'countryPicker'" [value]="value()" (valueChange)="value.set($event)">
      <hlm-combobox-trigger class="w-full justify-between font-normal">
        @if (value()) {
          <adm-country-display [country]="value()" />
        } @else {
          {{ t('selectCountryPlaceholder') }}
        }
      </hlm-combobox-trigger>

      <hlm-combobox-content *hlmComboboxPortal>
        <hlm-combobox-input showTrigger="false" mode="popup" [placeholder]="t('searchCountryPlaceholder')">
          <hlm-input-group-addon>
            <ng-icon name="lucideSearch" />
          </hlm-input-group-addon>
        </hlm-combobox-input>

        <hlm-combobox-empty *transloco="let t">{{ t('common.noData') }}</hlm-combobox-empty>

        <div hlmComboboxList>
          @for (country of countriesList(); track country.id) {
            <hlm-combobox-item [value]="country">
              <adm-country-display [country]="country" />
            </hlm-combobox-item>
          }
        </div>
      </hlm-combobox-content>
    </hlm-combobox>
  `,
})
export class CountryPicker implements FormValueControl<Country | null> {
  // ==========================================
  // Inputs
  // ==========================================
  public readonly value = model<Country | null>(null);

  // ==========================================
  // State
  // ==========================================
  protected readonly countriesList = signal(countries);
}
