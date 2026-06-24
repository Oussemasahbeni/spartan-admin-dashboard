import { Component, inject } from '@angular/core';
import { ThemeService } from '@core/config/theme-service';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

import { HlmKbd } from '@spartan-ng/helm/kbd';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'adm-theme-switch',
  imports: [NgIcon, HlmButtonImports, HlmTooltipImports, HlmKbd, TranslocoModule],
  providers: [
    provideIcons({
      lucideMoon,
      lucideSun,
    }),
  ],
  host: {
    '(window:keydown)': 'onKeydown($event)',
  },
  template: `
    <button
      type="button"
      variant="outline"
      hlmBtn
      size="icon"
      class="relative"
      [aria-label]="'header.toggleTheme' | transloco"
      [hlmTooltip]="tooltip"
      [position]="'bottom'"
      (click)="toggleTheme()"
    >
      <ng-icon name="lucideSun" class="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <ng-icon name="lucideMoon" class="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
    </button>

    <ng-template #tooltip>
      <span class="flex items-center justify-center gap-2">
        {{ 'header.toggleTheme' | transloco }}
        <kbd hlmKbd class="bg-primary-foreground/20 text-primary-foreground">D</kbd>
      </span>
    </ng-template>
  `,
})
export class ThemeSwitch {
  // ==========================================
  // Services
  // ==========================================
  private readonly _themeService = inject(ThemeService);

  // ==========================================
  // Public Methods
  // ==========================================
  protected toggleTheme(): void {
    this._themeService.setTheme(this._themeService.resolvedTheme() === 'dark' ? 'light' : 'dark');
  }

  protected onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable]')) return;

    if (event.key.toLowerCase() === 'd' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      this.toggleTheme();
    }
  }
}
