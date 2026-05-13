import { NgOptimizedImage } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { countries, Country } from '../../countries';

@Component({
  selector: 'adm-country-display',
  imports: [HlmIconImports, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolvedCountry(); as country) {
      <div class="flex items-center gap-2">
        <img
          width="16"
          height="16"
          class="h-4 w-4 object-cover"
          [ngSrc]="'/images/flags/' + country.iso.toLowerCase() + '.svg'"
          [alt]="country.name[activeLang()]"
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
  // ==========================================
  // Services
  // ==========================================
  private readonly _transloco = inject(TranslocoService);

  // ==========================================
  // Inputs
  // ==========================================
  public readonly country = input.required<string | Country | null | undefined>();
  public readonly showCountryCode = input(false, { transform: booleanAttribute });

  // ==========================================
  // State
  // ==========================================
  protected readonly activeLang = computed(() => this._transloco.activeLang());

  protected readonly resolvedCountry = computed(() => {
    const val = this.country();
    if (!val) return null;

    if (typeof val !== 'string') return val;

    return countries.find((c) => c.iso.toLowerCase() === val.toLowerCase()) ?? null;
  });
}
