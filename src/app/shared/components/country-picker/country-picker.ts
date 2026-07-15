import { booleanAttribute, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

import { countries, Country } from '../../countries';
import { CountryDisplay } from '../country-display/country-display';

@Component({
  selector: 'adm-country-picker',
  imports: [HlmButtonImports, HlmComboboxImports, TranslocoModule, CountryDisplay],
  template: `
    <hlm-combobox
      *transloco="let t; prefix: 'countryPicker'"
      [value]="value()"
      [disabled]="disabled()"
      [itemToString]="itemToString"
      (valueChange)="value.set($event)"
      (closed)="touch.emit()"
    >
      <hlm-combobox-input inputId="country" showClear="true" [placeholder]="t('selectCountryPlaceholder')" />

      <hlm-combobox-content *hlmComboboxPortal>
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
export class CountryPicker implements FormValueControl<Country | null | undefined> {
  private static _id = 0;

  private readonly _transloco = inject(TranslocoService);

  // ==========================================
  // Inputs
  // ==========================================
  public readonly inputId = input(`country-picker-${CountryPicker._id++}`);
  public readonly value = model<Country | null | undefined>(null);
  public readonly touch = output<void>();
  public readonly disabled = input(false, { transform: booleanAttribute });

  // ==========================================
  // State
  // ==========================================

  protected readonly countriesList = signal(countries);
  protected readonly activeLang = computed(() => this._transloco.activeLang());
  public readonly itemToString = (country: Country): string => country.name[this.activeLang()] ?? country.name['en'] ?? '';
}
