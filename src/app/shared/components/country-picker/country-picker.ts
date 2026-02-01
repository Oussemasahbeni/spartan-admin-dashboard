import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
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
    BrnPopoverContent,
    TranslocoModule,
    CountryDisplay,
  ],
  providers: [
    provideIcons({
      lucideSearch,
    }),
  ],
  templateUrl: './country-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryPicker implements FormValueControl<Country | null> {
  // ==========================================
  // Inputs
  // ==========================================
  readonly value = model<Country | null>(null);

  // ==========================================
  // State
  // ==========================================
  protected readonly countriesList = signal(countries);
}
