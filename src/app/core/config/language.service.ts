import { isPlatformBrowser, registerLocaleData } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BrnCalendarI18n, injectBrnCalendarI18n } from '@spartan-ng/brain/calendar';
import { arabicCalendarI18n, englishCalendarI18n, frenchCalendarI18n } from './date-I18n';
import { DirectionalityService } from './directionality.service';
import { LOCAL_STORAGE } from './tokens';

export const LANGUAGES = ['en', 'fr', 'ar'] as const;
export type Language = (typeof LANGUAGES)[number];

export interface AvailableLanguage {
  code: Language;
  label: string;
}

const registeredLocales = new Set<string>(['en']);

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly _translocoService = inject(TranslocoService);
  private readonly _dir = inject(DirectionalityService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _localStorage = inject(LOCAL_STORAGE);
  private readonly _calendarI18n = injectBrnCalendarI18n();

  public readonly currentLang = computed(() => this._translocoService.activeLang() as Language);

  private readonly _availableLanguages = signal<AvailableLanguage[]>([
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
  public readonly availableLanguages = this._availableLanguages.asReadonly();

  private readonly brnCaalendarI18nMap: Record<Language, Partial<BrnCalendarI18n>> = {
    en: englishCalendarI18n,
    fr: frenchCalendarI18n,
    ar: arabicCalendarI18n,
  };

  constructor() {
    if (isPlatformBrowser(this._platformId)) {
      const browserLang = navigator.language?.split('-')[0];
      if (browserLang && browserLang === 'ar') {
        this._dir.updateDirection('rtl');
      }
    }
  }

  async setLanguage(lang: Language): Promise<void> {
    this._calendarI18n.use(this.brnCaalendarI18nMap[lang]);
    this._localStorage?.setItem('lang', lang);
    await this._ensureLocaleRegistered(lang);
    this._translocoService.setActiveLang(lang);
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    this._dir.updateDirection(direction);
  }

  private async _ensureLocaleRegistered(lang: Language): Promise<void> {
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
