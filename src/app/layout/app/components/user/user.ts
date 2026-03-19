import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { LanguageOptions, LanguageService } from '@core/config/language.service';
import { ThemeService } from '@core/config/theme.service';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideCheck,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideGem,
  lucideGlobe,
  lucideHelpCircle,
  lucideLogOut,
  lucideMonitor,
  lucideMoon,
  lucidePalette,
  lucideSun,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { User } from '../../../../shared/models/user';

@Component({
  selector: 'adm-user',
  imports: [HlmSidebarImports, HlmAvatarImports, HlmIconImports, HlmDropdownMenuImports, HlmBadgeImports, TranslocoModule],
  templateUrl: './user.html',
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideGem,
      lucideBadgeCheck,
      lucideLogOut,
      lucideGlobe,
      lucideCheck,
      lucidePalette,
      lucideMoon,
      lucideSun,
      lucideMonitor,
      lucideHelpCircle,
      lucideCreditCard,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavUser {
  // ==========================================
  // Services
  // ==========================================

  private readonly _sidebarService = inject(HlmSidebarService);
  private readonly _languageService = inject(LanguageService);
  private readonly _themeService = inject(ThemeService);
  private readonly _authService = inject(AuthService);

  // ==========================================
  // Inputs
  // ==========================================

  readonly _user = input.required<User>({ alias: 'user' });

  // ==========================================
  // State
  // ==========================================

  protected readonly currentTheme = this._themeService.theme;
  protected readonly currentLang = this._languageService.currentLang;
  protected readonly availableLanguages = this._languageService.availableLanguages;

  protected readonly _menuSide = computed(() => (this._sidebarService.isMobile() ? 'top' : 'right'));

  // ==========================================
  // Public Methods
  // ==========================================

  protected setLang(lang: LanguageOptions): void {
    if (lang === this.currentLang()) return;
    this._languageService.setLanguage(lang);
  }
  protected setTheme(theme: 'light' | 'dark' | 'system'): void {
    this._themeService.setTheme(theme);
  }

  protected onLogout(): void {
    this._authService.logout();
  }
}
