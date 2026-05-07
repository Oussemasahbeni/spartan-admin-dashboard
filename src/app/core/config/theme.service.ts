import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { LOCAL_STORAGE, WINDOW } from '@core/config/tokens';

export type Theme = 'light' | 'dark' | 'system';
export const THEMES: Theme[] = ['light', 'dark', 'system'] as const;

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _localStorage = inject(LOCAL_STORAGE);
  private readonly _window = inject(WINDOW);
  private readonly _localStorageKey = 'theme-preference';

  private readonly _theme = signal<Theme>('system');
  public readonly theme = this._theme.asReadonly();

  private readonly _darkMediaQuery = this._window?.matchMedia('(prefers-color-scheme: dark)');

  init(): void {
    if (!isPlatformBrowser(this._platformId)) return;

    const savedTheme = this._localStorage?.getItem(this._localStorageKey) as Theme;

    const validThemes: Theme[] = ['light', 'dark', 'system'];

    const initialTheme = validThemes.includes(savedTheme) ? savedTheme : 'system';
    this.setTheme(initialTheme);
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);

    if (isPlatformBrowser(this._platformId)) {
      this._localStorage?.setItem(this._localStorageKey, theme);
      this._applyDomChanges(theme);
    }
  }

  private _applyDomChanges(theme: Theme): void {
    const isDark = theme === 'dark' || (theme === 'system' && this._darkMediaQuery?.matches);

    if (isDark) {
      this.document.documentElement.classList.add('dark');
    } else {
      this.document.documentElement.classList.remove('dark');
    }
  }
}
