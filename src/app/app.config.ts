import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { provideNgIconsConfig, withExceptionLogger } from '@ng-icons/core';
import { routes } from './app.routes';
import { LanguageOptions, LanguageService } from './core/config/language.service';
import { ThemeService } from './core/config/theme.service';
import { TranslateTitleStrategy } from './core/config/title-i18n-strategy';
import { TranslocoHttpLoader } from './transloco-loader';

import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeFr from '@angular/common/locales/fr';
import { mockApiInterceptor } from '@core/interceptor/mock-api.interceptor';
import { provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { format } from 'date-fns/format';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeAr, 'ar');

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
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(withInterceptors([mockApiInterceptor])),
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
    provideNgIconsConfig({}, withExceptionLogger()),
    provideEnvironmentInitializer(() => {
      const themeService = inject(ThemeService);
      const languageService = inject(LanguageService);
      const savedLang = localStorage.getItem('lang') as LanguageOptions | null;
      if (savedLang) {
        languageService.setLanguage(savedLang);
      }
      themeService.init();
    }),
    provideHlmDatePickerConfig({
      formatDate: (date: Date) => format(date, 'dd-MM-yyyy'),
    }),

    {
      provide: TitleStrategy,
      useClass: TranslateTitleStrategy,
    },
  ],
};
