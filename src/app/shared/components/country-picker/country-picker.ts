import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormValueControl } from '@angular/forms/signals';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucideChevronsUpDown, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { countries, Country } from '../../countries';
import { MatchWidthDirective } from '../../directives/matchWidth.directive';
import { CountryDisplay } from '../country-display/country-display';

@Component({
  selector: 'app-country-picker',
  imports: [
    HlmButtonImports,
    HlmInputImports,
    BrnCommandImports,
    HlmCommandImports,
    BrnPopoverImports,
    HlmPopoverImports,
    HlmIconImports,
    TranslocoModule,
    MatchWidthDirective,
    CountryDisplay,
  ],
  providers: [
    provideIcons({
      lucideCheck,
      lucideSearch,
      lucideChevronDown,
      lucideChevronsUpDown,
    }),
  ],
  templateUrl: './country-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryPicker implements FormValueControl<Country | null> {
  private readonly _transloco = inject(TranslocoService);

  readonly value = model<Country | null>(null);

  protected readonly _countriesList = signal(countries);
  protected readonly state = signal<'closed' | 'open'>('closed');

  protected readonly activeLang = toSignal(this._transloco.langChanges$, { initialValue: this._transloco.getActiveLang() });

  public readonly triggerWidth = signal<number>(0);

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  countrySelected(country: Country) {
    this.state.set('closed');
    this.value.set(country);
  }
}
