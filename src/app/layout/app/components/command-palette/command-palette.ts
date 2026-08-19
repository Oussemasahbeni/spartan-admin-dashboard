import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth-service';
import { Language, LanguageService } from '@core/config/language-service';
import { Theme, ThemeService } from '@core/config/theme-service';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBot,
  lucideCalendarDays,
  lucideCheck,
  lucideFolderOpen,
  lucideGauge,
  lucideKanbanSquare,
  lucideLanguages,
  lucideLayoutDashboard,
  lucideLogOut,
  lucideMaximize,
  lucideMoon,
  lucidePanelLeft,
  lucideSearch,
  lucideSettings,
  lucideSun,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

import { HlmKbdImports } from '@spartan-ng/helm/kbd';
import { HlmSidebarService } from '@spartan-ng/helm/sidebar';

interface NavCommand {
  key: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'adm-command-palette',
  imports: [HlmKbdImports, HlmCommandImports, NgIcon, HlmDialogImports, HlmButtonImports, TranslocoDirective],
  host: {
    '(window:keydown)': 'onKeyDown($event)',
  },
  providers: [
    provideIcons({
      lucideBot,
      lucideCalendarDays,
      lucideCheck,
      lucideFolderOpen,
      lucideKanbanSquare,
      lucideGauge,
      lucideLanguages,
      lucideLayoutDashboard,
      lucideLogOut,
      lucideMaximize,
      lucideMoon,
      lucidePanelLeft,
      lucideSearch,
      lucideSettings,
      lucideSun,
      lucideUsers,
    }),
  ],
  template: `
    <ng-container *transloco="let t">
      <button
        hlmBtn
        type="button"
        variant="secondary"
        class="text-muted-foreground hidden min-w-60 justify-between sm:flex"
        (click)="state.set('open')"
      >
        <span class="flex items-center gap-2">
          <ng-icon name="lucideSearch" />
          {{ t('commandPalette.search') }}
        </span>
        <kbd hlmKbd class="ms-2">⌘ + K</kbd>
      </button>
      <hlm-command-dialog [state]="state()" (stateChange)="stateChanged($event)">
        <hlm-command>
          <hlm-command-input [placeholder]="t('commandPalette.placeholder')" />
          <hlm-command-list>
            <div *hlmCommandEmptyState hlmCommandEmpty>{{ t('commandPalette.noResults') }}</div>

            <hlm-command-group>
              <hlm-command-group-label>{{ t('commandPalette.navigation') }}</hlm-command-group-label>
              @for (item of navCommands; track item.key) {
                <button type="button" hlm-command-item [value]="t('navigation.' + item.key)" (selected)="navigate(item.url)">
                  <ng-icon [name]="item.icon" />
                  {{ t('navigation.' + item.key) }}
                </button>
              }
            </hlm-command-group>

            <hlm-command-separator />

            <hlm-command-group>
              <hlm-command-group-label>{{ t('commandPalette.quickActions') }}</hlm-command-group-label>
              <button
                type="button"
                hlm-command-item
                [value]="t('commandPalette.collapseSidebar')"
                (selected)="toggleSidebar()"
              >
                <ng-icon name="lucidePanelLeft" />
                {{ isSidebarOpen() ? t('commandPalette.collapseSidebar') : t('commandPalette.expandSidebar') }}
                <hlm-command-shortcut>⌘B</hlm-command-shortcut>
              </button>
              <button type="button" hlm-command-item [value]="t('navUser.logout')" (selected)="logout()">
                <ng-icon name="lucideLogOut" />
                {{ t('navUser.logout') }}
              </button>
            </hlm-command-group>

            <hlm-command-separator />

            <hlm-command-group>
              <hlm-command-group-label>{{ t('commandPalette.language') }}</hlm-command-group-label>
              @for (lang of availableLanguages(); track lang.code) {
                <button type="button" hlm-command-item [value]="lang.label" (selected)="setLanguage(lang.code)">
                  <ng-icon name="lucideLanguages" />
                  {{ lang.label }}
                  @if (currentLang() === lang.code) {
                    <ng-icon name="lucideCheck" class="ms-auto" />
                  }
                </button>
              }
            </hlm-command-group>

            <hlm-command-separator />

            <hlm-command-group>
              <hlm-command-group-label>{{ t('commandPalette.theme') }}</hlm-command-group-label>
              <button type="button" hlm-command-item [value]="t('theme.light')" (selected)="setTheme('light')">
                <ng-icon name="lucideSun" />
                {{ t('theme.light') }}
                @if (currentTheme() === 'light') {
                  <ng-icon name="lucideCheck" class="ms-auto" />
                }
              </button>
              <button type="button" hlm-command-item [value]="t('theme.dark')" (selected)="setTheme('dark')">
                <ng-icon name="lucideMoon" />
                {{ t('theme.dark') }}
                @if (currentTheme() === 'dark') {
                  <ng-icon name="lucideCheck" class="ms-auto" />
                }
              </button>
            </hlm-command-group>
          </hlm-command-list>
        </hlm-command>
      </hlm-command-dialog>
    </ng-container>
  `,
})
export class CommandPalette {
  // ==========================================
  // Services
  // ==========================================
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _themeService = inject(ThemeService);
  private readonly _languageService = inject(LanguageService);
  private readonly _sidebarService = inject(HlmSidebarService);

  // ==========================================
  // State
  // ==========================================

  protected readonly state = signal<'closed' | 'open'>('closed');

  protected readonly currentTheme = this._themeService.theme;
  protected readonly currentLang = this._languageService.currentLang;
  protected readonly availableLanguages = this._languageService.availableLanguages;
  protected readonly isSidebarOpen = computed(() => this._sidebarService.open());

  protected readonly navCommands: NavCommand[] = [
    { key: 'dashboard-1', icon: 'lucideGauge', url: '/dashboard/dashboard-1' },
    { key: 'dashboard-2', icon: 'lucideLayoutDashboard', url: '/dashboard/dashboard-2' },
    { key: 'users', icon: 'lucideUsers', url: '/users' },
    { key: 'calendar', icon: 'lucideCalendarDays', url: '/calendar' },
    { key: 'kanban', icon: 'lucideKanbanSquare', url: '/kanban' },
    { key: 'fileManager', icon: 'lucideFolderOpen', url: '/file-manager' },
    { key: 'settings', icon: 'lucideSettings', url: '/settings' },
    { key: 'aiAssistant', icon: 'lucideBot', url: '/assistant' },
  ];

  // ==========================================
  // Protected Methods
  // ==========================================

  protected onKeyDown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && (event.key === 'k' || event.key === 'K')) {
      if (
        (event.target instanceof HTMLElement && event.target.isContentEditable) ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }
      event.preventDefault();
      this.state.set('open');
    }
  }

  protected navigate(url: string): void {
    this.state.set('closed');
    void this._router.navigateByUrl(url);
  }

  protected toggleSidebar(): void {
    this._sidebarService.toggleSidebar();
    this.state.set('closed');
  }

  protected logout(): void {
    this.state.set('closed');
    void this._authService.logout();
  }

  protected setLanguage(lang: Language): void {
    void this._languageService.setLanguage(lang);
    this.state.set('closed');
  }

  protected setTheme(theme: Theme): void {
    this._themeService.setTheme(theme);
    this.state.set('closed');
  }

  protected stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }
}
