import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { provideNgIconsConfig, withExceptionLogger } from '@ng-icons/core';
import { routes } from './app.routes';
import { availableLangs, LanguageOptions, LanguageService } from './core/config/language.service';
import { FlagBasedPreloadingStrategy } from './core/config/flag-based-preloading.strategy';
import { ThemeService } from './core/config/theme.service';
import { TranslateTitleStrategy } from './core/config/title-i18n-strategy';
import { TranslocoHttpLoader } from './transloco-loader';

import { mockApiInterceptor } from '@core/interceptor/mock-api.interceptor';
import { provideHlmSidebarConfig } from '@spartan-ng/helm/sidebar';

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
      withPreloading(FlagBasedPreloadingStrategy),
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
    provideAppInitializer(async () => {
      const themeService = inject(ThemeService);
      const languageService = inject(LanguageService);
      const savedLang = localStorage.getItem('lang') as LanguageOptions | null;
      if (savedLang) {
        await languageService.setLanguage(savedLang);
      }
      themeService.init();
    }),
    provideHlmSidebarConfig({
      closeMobileSidebarOnMenuButtonClick: true,
    }),
    {
      provide: TitleStrategy,
      useClass: TranslateTitleStrategy,
    },
  ],
};
