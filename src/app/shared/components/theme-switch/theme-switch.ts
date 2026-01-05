import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '@core/config/theme.service';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideMonitor, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';

@Component({
  selector: 'adm-theme-switch',
  imports: [HlmDropdownMenuImports, HlmIconImports, HlmButtonImports, TranslocoModule],
  providers: [
    provideIcons({
      lucideMoon,
      lucideSun,
      lucideCheck,
      lucideMonitor,
    }),
  ],
  template: `
    <button type="button" variant="outline" hlmBtn size="icon" [hlmDropdownMenuTrigger]="menu">
      <ng-icon hlmIcon size="sm" [name]="iconName()" />
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu *transloco="let t" class="w-56">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitch {
  private readonly _themeService = inject(ThemeService);

  readonly currentTheme = this._themeService.theme;

  readonly iconName = computed(() => {
    const theme = this.currentTheme();
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = theme === 'dark' || (theme === 'system' && isDarkSystem);
    
    return isDark ? 'lucideSun' : 'lucideMoon';
  });

  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this._themeService.setTheme(theme);
  }
}
