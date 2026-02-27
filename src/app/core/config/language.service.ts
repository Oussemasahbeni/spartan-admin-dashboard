import { registerLocaleData } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { DirectionalityService } from './directionality.service';

export type LanguageOptions = 'en' | 'fr' | 'ar';

export interface AvailableLanguage {
  code: LanguageOptions;
  label: string;
}

const registeredLocales = new Set<string>(['en']);

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly _translocoService = inject(TranslocoService);
  private readonly _directionalityService = inject(DirectionalityService);

  readonly _currentLang = signal<LanguageOptions>('en');
  readonly currentLang = this._currentLang.asReadonly();

  readonly availableLanguages = signal<AvailableLanguage[]>([
    {
      code: 'en',
      label: 'English',
    },
    {
      code: 'fr',
      label: 'Français',
    },
    {
      code: 'ar',
      label: 'العربية',
    },
  ]);

  async setLanguage(lang: LanguageOptions): Promise<void> {
    this._currentLang.set(lang);
    localStorage.setItem('lang', lang);
    await this._ensureLocaleRegistered(lang);
    this._translocoService.setActiveLang(lang);
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this._directionalityService.updateDirection(direction);
  }

  private async _ensureLocaleRegistered(lang: LanguageOptions): Promise<void> {
    if (registeredLocales.has(lang)) return;

    if (lang === 'fr') {
      const localeFr = (await import('@angular/common/locales/fr')).default;
      registerLocaleData(localeFr, 'fr');
    } else if (lang === 'ar') {
      const localeAr = (await import('@angular/common/locales/ar')).default;
      registerLocaleData(localeAr, 'ar');
    }

    registeredLocales.add(lang);
  }
}
