import { computed, DOCUMENT, effect, inject, Injectable, signal } from '@angular/core';
import { LOCAL_STORAGE, WINDOW } from '@core/config/tokens';
export const THEMES = ['light', 'dark', 'system'] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = 'theme-preference';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly _localStorage = inject(LOCAL_STORAGE);
  private readonly _mediaQuery = inject(WINDOW)?.matchMedia('(prefers-color-scheme: dark)');
  private readonly _systemPrefersDark = signal(this._mediaQuery?.matches ?? false);

  private readonly _selectedTheme = signal<Theme>('system');
  public readonly theme = this._selectedTheme.asReadonly();

  public readonly resolvedTheme = computed(() => {
    if (this._selectedTheme() === 'system') {
      return this._systemPrefersDark() ? 'dark' : 'light';
    }
    return this._selectedTheme();
  });

  constructor() {
    const savedTheme = this._localStorage?.getItem(STORAGE_KEY) as Theme;

    this._selectedTheme.set(THEMES.includes(savedTheme) ? savedTheme : 'system');
    this._mediaQuery?.addEventListener('change', (e) => {
      this._systemPrefersDark.set(e.matches);
    });

    effect(() => {
      this.document.documentElement.classList.toggle('dark', this.resolvedTheme() === 'dark');
    });
  }

  setTheme(theme: Theme): void {
    this._selectedTheme.set(theme);
    this._localStorage?.setItem(STORAGE_KEY, theme);
  }
}
