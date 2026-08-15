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
  withExperimentalAutoCleanupInjectors,
  withInMemoryScrolling,
  withPreloading,
  withViewTransitions,
} from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';
import { provideNgIconsConfig, withExceptionLogger } from '@ng-icons/core';
import { routes } from './app.routes';
import { FlagBasedPreloadingStrategy } from './core/config/flag-based-preloading-strategy';
import { Language, LANGUAGES, LanguageService } from './core/config/language-service';
import { ThemeService } from './core/config/theme-service';
import { TranslateTitleStrategy } from './core/config/title-i18n-strategy';
import { TranslocoHttpLoader } from './transloco-loader';

import { provideHlmSidebarConfig } from '@spartan-ng/helm/sidebar';
import { provideSpartanHlm } from '@spartan-ng/helm/utils';

function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}

function initialLanguage(): Language {
  const storedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;
  if (storedLang && isLanguage(storedLang)) {
    return storedLang;
  }

  const browserLang = typeof navigator !== 'undefined' ? navigator.language?.split('-')[0] : undefined;
  if (browserLang && isLanguage(browserLang)) {
    return browserLang;
  }

  return 'en';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withExperimentalAutoCleanupInjectors(),
      withViewTransitions(),
      withPreloading(FlagBasedPreloadingStrategy),
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'fr', 'ar'],
        defaultLang: initialLanguage(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
        flatten: {
          aot: !isDevMode(),
        },
      },
      loader: TranslocoHttpLoader,
    }),
    provideNgIconsConfig({}, withExceptionLogger()),
    provideSpartanHlm(),
    provideAppInitializer(async () => {
      // Eagerly instantiate ThemeService so it applies the `dark` class
      // before the first paint (prevents theme flicker on startup).
      inject(ThemeService);

      // `defaultLang` only initializes Transloco's active language.
      // We still call LanguageService to apply app-level side effects:
      // direction (rtl/ltr), calendar i18n, and locale registration.
      const languageService = inject(LanguageService);
      await languageService.setLanguage(initialLanguage());
    }),

    provideHlmSidebarConfig({
      closeMobileSidebarOnMenuButtonClick: true,
    }),
    {
      // useExisting: TranslateTitleStrategy is already root-provided via @Service()
      provide: TitleStrategy,
      useExisting: TranslateTitleStrategy,
    },
  ],
};
