import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { routes } from './app.routes';
import {
  LanguageOptions,
  LanguageService,
} from './core/config/language.service';
import { ThemeService } from './core/config/theme.service';
import { TranslocoHttpLoader } from './transloco-loader';

const availableLangs = ['en', 'fr', 'ar'];

function getDefaultLanguage(): string {
  const storedLang = localStorage.getItem('lang');
  if (storedLang && availableLangs.includes(storedLang)) {
    return storedLang;
  }

  const browserLang = navigator.language?.split('-')[0];
  if (browserLang && availableLangs.includes(browserLang)) {
    return browserLang;
  }

  return 'en';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'fr', 'ar'],
        defaultLang: getDefaultLanguage(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        flatten: {
          aot: !isDevMode(),
        },
      },
      loader: TranslocoHttpLoader,
    }),
    provideEnvironmentInitializer(() => {
      const themeService = inject(ThemeService);
      const languageService = inject(LanguageService);
      const savedLang = localStorage.getItem('lang') as LanguageOptions | null;
      if (savedLang) {
        languageService.setLanguage(savedLang);
      }
      themeService.init();
    }),
  ],
};
