import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideCheck,
  lucideChevronsUpDown,
  lucideGlobe,
  lucideLogOut,
  lucideMonitor,
  lucideMoon,
  lucidePalette,
  lucideSparkles,
  lucideSun,
} from '@ng-icons/lucide';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import {
  LanguageOptions,
  LanguageService,
} from '../../../core/config/language.service';
import { ThemeService } from '../../../core/config/theme.service';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../features/users/user.type';

@Component({
  selector: 'user',
  imports: [
    HlmSidebarImports,
    HlmAvatarImports,
    HlmIconImports,
    HlmDropdownMenuImports,
    TranslocoModule,
  ],
  templateUrl: './user.html',
  providers: [
    provideIcons({
      lucideChevronsUpDown,
      lucideSparkles,
      lucideBadgeCheck,
      lucideLogOut,
      lucideGlobe,
      lucideCheck,
      lucidePalette,
      lucideMoon,
      lucideSun,
      lucideMonitor,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavUser {
  private readonly _sidebarService = inject(HlmSidebarService);
  private readonly _languageService = inject(LanguageService);
  private readonly _themeService = inject(ThemeService);
  private readonly _router = inject(Router);
  private readonly _userService = inject(UserService);
  readonly currentTheme = this._themeService.theme;
  readonly currentLang = this._languageService.currentLang;

  readonly availableLanguages = this._languageService.availableLanguages;

  protected readonly _menuSide = computed(() =>
    this._sidebarService.isMobile() ? 'top' : 'right',
  );

  public readonly user = input.required<User>();

  setLang(lang: LanguageOptions): void {
    this._languageService.setLanguage(lang);
  }
  setTheme(theme: 'light' | 'dark' | 'system'): void {
    this._themeService.setTheme(theme);
  }

  onLogout(): void {
    localStorage.removeItem('token');
    this._userService.clearUser();
    this._router.navigate(['/login']);
  }
}
