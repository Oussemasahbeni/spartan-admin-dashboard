import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Theme, THEMES, ThemeService } from '@core/config/theme.service';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmKbd } from '@spartan-ng/helm/kbd';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'adm-theme-switch',
  imports: [HlmDropdownMenuImports, HlmIconImports, HlmButtonImports, HlmTooltipImports, HlmKbd, TranslocoModule],
  providers: [
    provideIcons({
      lucideMoon,
      lucideSun,
      lucideCheck,
      lucideMonitor,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'onKeydown($event)',
  },
  template: `
    <button
      type="button"
      variant="outline"
      hlmBtn
      size="icon"
      [hlmDropdownMenuTrigger]="menu"
      [aria-label]="'header.toggleTheme' | transloco"
      [hlmTooltip]="tooltip"
      [position]="'bottom'"
    >
      <ng-icon hlmIcon size="sm" [name]="iconName()" />
    </button>

    <ng-template #tooltip>
      <span class="flex items-center justify-center gap-2">
        {{ 'header.toggleTheme' | transloco }}
        <kbd hlmKbd class="bg-primary-foreground/20 text-primary-foreground">D</kbd>
      </span>
    </ng-template>

    <ng-template #menu>
      <hlm-dropdown-menu *transloco="let t">
        @let theme = currentTheme();

        <button type="button" hlmDropdownMenuItem (click)="setTheme('light')">
          <ng-icon hlmIcon name="lucideSun" size="sm" />
          <span> {{ t('theme.light') }} </span>
          @if (theme === 'light') {
            <ng-icon hlmIcon name="lucideCheck" size="sm" class="ms-auto" />
          }
        </button>

        <button type="button" hlmDropdownMenuItem (click)="setTheme('dark')">
          <ng-icon hlmIcon name="lucideMoon" size="sm" />
          <span> {{ t('theme.dark') }} </span>
          @if (theme === 'dark') {
            <ng-icon hlmIcon name="lucideCheck" size="sm" class="ms-auto" />
          }
        </button>

        <button type="button" hlmDropdownMenuItem (click)="setTheme('system')">
          <ng-icon hlmIcon name="lucideMonitor" size="sm" />
          <span> {{ t('theme.system') }} </span>
          @if (theme === 'system') {
            <ng-icon hlmIcon name="lucideCheck" size="sm" class="ms-auto" />
          }
        </button>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class ThemeSwitch {
  // ==========================================
  // Services
  // ==========================================
  private readonly _themeService = inject(ThemeService);

  // ==========================================
  // State
  // ==========================================
  protected readonly currentTheme = this._themeService.theme;

  protected readonly iconName = computed(() => (this._themeService.resolvedTheme() === 'dark' ? 'lucideSun' : 'lucideMoon'));

  // ==========================================
  // Public Methods
  // ==========================================
  protected setTheme(theme: Theme): void {
    this._themeService.setTheme(theme);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, [contenteditable]')) return;

    const current = THEMES.indexOf(this.currentTheme());
    if (current === -1) return;

    if (event.key.toLowerCase() === 'd' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      this.setTheme(THEMES[(current + 1) % THEMES.length]);
    }
  }
}
