import { inject, Injectable, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { DirectionalityService } from '../shared/service/directionality.service';

export type LanguageOptions = 'en' | 'fr' | 'ar';

export interface AvailableLanguage {
  code: LanguageOptions;
  label: string;
}

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

  constructor() {
   
  }

  setLanguage(lang: LanguageOptions): void {
    this._currentLang.set(lang);
    localStorage.setItem('lang', lang);
    this._translocoService.setActiveLang(lang);
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this._directionalityService.updateDirection(direction);
  }
}
