import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Country, countries } from '../../countries';

@Component({
  selector: 'app-country-display',
  imports: [HlmIconImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolvedCountry(); as country) {
      <div class="flex items-center gap-2">
        <img
          width="20"
          loading="lazy"
          [src]="'https://flagcdn.com/w40/' + country.iso.toLowerCase() + '.png'"
          [alt]="country.name"
        />
        @if (showCountryCode()) {
          <span class="text-muted-foreground font-mono text-sm">{{ country.code }}</span>
        } @else {
          <span>{{ country.name[activeLang()] }}</span>
        }
      </div>
    }
  `,
})
export class CountryDisplay {
  private readonly _transloco = inject(TranslocoService);

  readonly country = input.required<string | Country | null | undefined>();
  readonly showCountryCode = input<boolean>(false);

  protected readonly activeLang = toSignal(this._transloco.langChanges$, { initialValue: this._transloco.getActiveLang() });

  protected readonly resolvedCountry = computed(() => {
    const val = this.country();
    if (!val) return null;

    if (typeof val !== 'string') return val;

    return countries.find((c) => c.iso.toLowerCase() === val.toLowerCase()) ?? null;
  });
}
